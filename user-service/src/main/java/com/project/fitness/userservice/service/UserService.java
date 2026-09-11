package com.project.fitness.userservice.service;

import com.project.fitness.userservice.dto.ChangePasswordRequest;
import com.project.fitness.userservice.dto.LoginRequest;
import com.project.fitness.userservice.dto.LoginResponse;
import com.project.fitness.userservice.dto.RegisterRequest;
import com.project.fitness.userservice.dto.UserResponse;
import com.project.fitness.userservice.dto.VerifyEmailRequest;
import com.project.fitness.userservice.dto.ResendOtpRequest;
import com.project.fitness.userservice.dto.ForgotPasswordRequest;
import com.project.fitness.userservice.dto.VerifyResetOtpRequest;
import com.project.fitness.userservice.dto.ResetPasswordRequest;
import com.project.fitness.userservice.model.User;
import com.project.fitness.userservice.model.UserRole;
import com.project.fitness.userservice.repository.UserRepository;
import com.project.fitness.userservice.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.project.fitness.userservice.dto.UpdateUserRequest;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final ProfileImageService profileImageService;
    // =========================================================
    // REGISTER
    // =========================================================

    public UserResponse register(RegisterRequest request) {

        var existingUser = userRepository.findByEmail(request.email());

        // =====================================================
        // EMAIL ALREADY EXISTS
        // =====================================================

        if (existingUser.isPresent()) {

            User user = existingUser.get();

            // Already verified
            if (user.isEmailVerified()) {

                throw new RuntimeException(
                        "Email already registered"
                );
            }

            // =================================================
            // EXISTING USER BUT EMAIL NOT VERIFIED
            // Generate a new OTP
            // =================================================

            String otp = generateOtp();

            user.setFirstName(request.firstName());

            user.setLastName(request.lastName());

            user.setPassword(
                    passwordEncoder.encode(
                            request.password()
                    )
            );

            user.setEmailVerificationOtp(otp);

            user.setOtpExpiry(
                    LocalDateTime.now().plusMinutes(10)
            );

            User savedUser = userRepository.save(user);

            // Send new OTP
            emailService.sendVerificationOtp(
                    savedUser.getEmail(),
                    otp
            );

            return UserResponse.from(savedUser);
        }

        // =====================================================
        // NEW USER
        // =====================================================

        String otp = generateOtp();

        User user = User.builder()
                .email(request.email())
                .password(
                        passwordEncoder.encode(
                                request.password()
                        )
                )
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role(
                        request.role() != null
                                ? request.role()
                                : UserRole.USER
                )
                .emailVerified(false)
                .emailVerificationOtp(otp)
                .otpExpiry(
                        LocalDateTime.now().plusMinutes(10)
                )
                .build();

        User savedUser = userRepository.save(user);

        // Send verification OTP
        emailService.sendVerificationOtp(
                savedUser.getEmail(),
                otp
        );

        return UserResponse.from(savedUser);
    }


    // =========================================================
    // VERIFY EMAIL
    // =========================================================

    public void verifyEmail(
            VerifyEmailRequest request) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // Already verified
        if (user.isEmailVerified()) {

            throw new RuntimeException(
                    "Email is already verified"
            );
        }

        // No OTP
        if (user.getEmailVerificationOtp() == null) {

            throw new RuntimeException(
                    "No active OTP. Please request a new OTP."
            );
        }

        // OTP expired
        if (user.getOtpExpiry() == null ||
                LocalDateTime.now()
                        .isAfter(user.getOtpExpiry())) {

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        // Wrong OTP
        if (!user.getEmailVerificationOtp()
                .equals(request.otp())) {

            throw new RuntimeException(
                    "Invalid OTP"
            );
        }

        // =====================================================
        // EMAIL VERIFIED
        // =====================================================

        user.setEmailVerified(true);

        // OTP no longer required
        user.setEmailVerificationOtp(null);

        user.setOtpExpiry(null);

        userRepository.save(user);
    }


    // =========================================================
    // RESEND REGISTRATION OTP
    // =========================================================

    public void resendOtp(
            ResendOtpRequest request) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // Already verified
        if (user.isEmailVerified()) {

            throw new RuntimeException(
                    "Email is already verified"
            );
        }

        // Generate new OTP
        String otp = generateOtp();

        user.setEmailVerificationOtp(otp);

        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(10)
        );

        userRepository.save(user);

        // Send OTP
        emailService.sendVerificationOtp(
                user.getEmail(),
                otp
        );
    }


    // =========================================================
    // GENERATE OTP
    // =========================================================

    private String generateOtp() {

        SecureRandom secureRandom =
                new SecureRandom();

        return String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );
    }


    // =========================================================
    // LOGIN
    // =========================================================

    public LoginResponse login(
            LoginRequest request) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        // Password check
        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // Email verification check
        if (!user.isEmailVerified()) {

            throw new RuntimeException(
                    "Please verify your email before logging in"
            );
        }

        // Generate JWT
        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return LoginResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    public void forgotPassword(
            ForgotPasswordRequest request) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException(
                                "No account found with this email"
                        )
                );

        // Email should already be verified
        if (!user.isEmailVerified()) {

            throw new RuntimeException(
                    "Please verify your email first"
            );
        }

        // Generate password reset OTP
        String resetOtp = generateOtp();

        // Save OTP
        user.setPasswordResetOtp(resetOtp);

        // OTP valid for 10 minutes
        user.setPasswordResetOtpExpiry(
                LocalDateTime.now().plusMinutes(10)
        );

        userRepository.save(user);

        // Send reset OTP email
        emailService.sendPasswordResetOtp(
                user.getEmail(),
                resetOtp
        );
    }


    // =========================================================
    // VERIFY RESET PASSWORD OTP
    // =========================================================

    public void verifyResetOtp(
            VerifyResetOtpRequest request) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // No reset OTP
        if (user.getPasswordResetOtp() == null) {

            throw new RuntimeException(
                    "No active password reset OTP"
            );
        }

        // Expiry missing
        if (user.getPasswordResetOtpExpiry() == null) {

            throw new RuntimeException(
                    "OTP expiry not found"
            );
        }

        // OTP expired
        if (LocalDateTime.now()
                .isAfter(user.getPasswordResetOtpExpiry())) {

            throw new RuntimeException(
                    "Password reset OTP has expired"
            );
        }

        // Wrong OTP
        if (!user.getPasswordResetOtp()
                .equals(request.otp())) {

            throw new RuntimeException(
                    "Invalid password reset OTP"
            );
        }

        // OTP is correct
        // We don't remove it yet because
        // resetPassword() will use it.

    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    public void resetPassword(
            ResetPasswordRequest request) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // =====================================================
        // CHECK OTP
        // =====================================================

        if (user.getPasswordResetOtp() == null) {

            throw new RuntimeException(
                    "No active password reset OTP"
            );
        }

        // =====================================================
        // CHECK OTP EXPIRY
        // =====================================================

        if (user.getPasswordResetOtpExpiry() == null ||
                LocalDateTime.now()
                        .isAfter(
                                user.getPasswordResetOtpExpiry()
                        )) {

            throw new RuntimeException(
                    "Password reset OTP has expired"
            );
        }

        // =====================================================
        // CHECK OTP
        // =====================================================

        if (!user.getPasswordResetOtp()
                .equals(request.otp())) {

            throw new RuntimeException(
                    "Invalid password reset OTP"
            );
        }

        // =====================================================
        // PASSWORD VALIDATION
        // =====================================================

        if (request.newPassword() == null ||
                request.newPassword().length() < 6) {

            throw new RuntimeException(
                    "New password must be at least 6 characters"
            );
        }

        // =====================================================
        // SAVE NEW PASSWORD
        // =====================================================

        user.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        // =====================================================
        // REMOVE RESET OTP
        // =====================================================

        user.setPasswordResetOtp(null);

        user.setPasswordResetOtpExpiry(null);

        userRepository.save(user);
    }


    // =========================================================
    // GET USER
    // =========================================================

    public UserResponse getUserById(
            Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return UserResponse.from(user);
    }


    // =========================================================
    // UPDATE USER
    // =========================================================

    public User updateUser(
            Long id,
            UpdateUserRequest request) {

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        user.setFirstName(
                request.firstName()
        );

        user.setLastName(
                request.lastName()
        );

        user.setEmail(
                request.email()
        );

        return userRepository.save(user);
    }


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    public void changePassword(
            Long id,
            ChangePasswordRequest request) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // =====================================================
        // CURRENT PASSWORD CHECK
        // =====================================================

        if (!passwordEncoder.matches(
                request.currentPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        // =====================================================
        // NEW PASSWORD VALIDATION
        // =====================================================

        if (request.newPassword() == null ||
                request.newPassword().length() < 6) {

            throw new RuntimeException(
                    "New password must be at least 6 characters"
            );
        }

        // =====================================================
        // SAVE NEW PASSWORD
        // =====================================================

        user.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        userRepository.save(user);
    }
    public UserResponse uploadProfileImage(
            Long id,
            org.springframework.web.multipart.MultipartFile file) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // Delete old image
        if (user.getProfileImage() != null &&
                !user.getProfileImage().isBlank()) {

            profileImageService.deleteImage(
                    user.getProfileImage()
            );
        }

        // Save new image
        String fileName =
                profileImageService.saveImage(
                        file,
                        id
                );

        user.setProfileImage(fileName);

        User savedUser =
                userRepository.save(user);

        return UserResponse.from(savedUser);
    }
    public UserResponse removeProfileImage(
            Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (user.getProfileImage() != null &&
                !user.getProfileImage().isBlank()) {

            profileImageService.deleteImage(
                    user.getProfileImage()
            );
        }

        user.setProfileImage(null);

        User savedUser =
                userRepository.save(user);

        return UserResponse.from(savedUser);
    }
    public byte[] getProfileImage(Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (user.getProfileImage() == null ||
                user.getProfileImage().isBlank()) {

            throw new RuntimeException(
                    "Profile image not found"
            );
        }

        return profileImageService.getImage(
                user.getProfileImage()
        );
    }
}