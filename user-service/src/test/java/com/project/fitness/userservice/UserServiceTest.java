package com.project.fitness.userservice;

import com.project.fitness.userservice.dto.*;
import com.project.fitness.userservice.model.User;
import com.project.fitness.userservice.model.UserRole;
import com.project.fitness.userservice.repository.UserRepository;
import com.project.fitness.userservice.security.JwtService;
import com.project.fitness.userservice.service.EmailService;
import com.project.fitness.userservice.service.ProfileImageService;
import com.project.fitness.userservice.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private EmailService emailService;

    @Mock
    private ProfileImageService profileImageService;

    @InjectMocks
    private UserService userService;


    // =========================================================
    // 1. REGISTER NEW USER
    // =========================================================

    @Test
    void register_shouldCreateNewUser() {

        RegisterRequest request = new RegisterRequest(
                "test@gmail.com",
                "password123",
                "Test",
                "User",
                UserRole.USER
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");

        User savedUser = User.builder()
                .id(1L)
                .email("test@gmail.com")
                .password("encodedPassword")
                .firstName("Test")
                .lastName("User")
                .role(UserRole.USER)
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        UserResponse response =
                userService.register(request);

        assertNotNull(response);
        assertEquals("test@gmail.com", response.email());
        assertEquals("Test", response.firstName());
        assertEquals("User", response.lastName());

        verify(userRepository, times(1))
                .findByEmail("test@gmail.com");

        verify(passwordEncoder, times(1))
                .encode("password123");

        verify(userRepository, times(1))
                .save(any(User.class));

        verify(emailService, times(1))
                .sendVerificationOtp(
                        eq("test@gmail.com"),
                        anyString()
                );
    }


    // =========================================================
    // 2. VERIFY EMAIL
    // =========================================================

    @Test
    void verifyEmail_shouldVerifyUser() {

        VerifyEmailRequest request =
                new VerifyEmailRequest(
                        "test@gmail.com",
                        "123456"
                );

        User user = User.builder()
                .id(1L)
                .email("test@gmail.com")
                .emailVerified(false)
                .emailVerificationOtp("123456")
                .otpExpiry(LocalDateTime.now().plusMinutes(5))
                .role(UserRole.USER)
                .build();

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        userService.verifyEmail(request);

        assertTrue(user.isEmailVerified());
        assertNull(user.getEmailVerificationOtp());
        assertNull(user.getOtpExpiry());

        verify(userRepository, times(1))
                .findByEmail("test@gmail.com");

        verify(userRepository, times(1))
                .save(user);
    }


    // =========================================================
    // 3. VERIFY EMAIL - WRONG OTP
    // =========================================================

    @Test
    void verifyEmail_shouldThrowExceptionForWrongOtp() {

        VerifyEmailRequest request =
                new VerifyEmailRequest(
                        "test@gmail.com",
                        "999999"
                );

        User user = User.builder()
                .id(1L)
                .email("test@gmail.com")
                .emailVerified(false)
                .emailVerificationOtp("123456")
                .otpExpiry(LocalDateTime.now().plusMinutes(5))
                .role(UserRole.USER)
                .build();

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> userService.verifyEmail(request)
                );

        assertEquals(
                "Invalid OTP",
                exception.getMessage()
        );

        verify(userRepository, never())
                .save(any(User.class));
    }


    // =========================================================
    // 4. LOGIN
    // =========================================================

    @Test
    void login_shouldReturnJwtToken() {

        LoginRequest request =
                new LoginRequest(
                        "test@gmail.com",
                        "password123"
                );

        User user = User.builder()
                .id(1L)
                .email("test@gmail.com")
                .password("encodedPassword")
                .firstName("Test")
                .lastName("User")
                .role(UserRole.USER)
                .emailVerified(true)
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "password123",
                "encodedPassword"
        )).thenReturn(true);

        when(jwtService.generateToken(
                1L,
                "test@gmail.com",
                "USER"
        )).thenReturn("test-jwt-token");

        LoginResponse response =
                userService.login(request);

        assertNotNull(response);
        assertEquals(
                "test-jwt-token",
                response.getToken()
        );

        assertNotNull(response.getUser());
        assertEquals(
                "test@gmail.com",
                response.getUser().email()
        );

        verify(userRepository, times(1))
                .findByEmail("test@gmail.com");

        verify(passwordEncoder, times(1))
                .matches(
                        "password123",
                        "encodedPassword"
                );

        verify(jwtService, times(1))
                .generateToken(
                        1L,
                        "test@gmail.com",
                        "USER"
                );
    }


    // =========================================================
    // 5. LOGIN - UNVERIFIED EMAIL
    // =========================================================

    @Test
    void login_shouldThrowExceptionWhenEmailNotVerified() {

        LoginRequest request =
                new LoginRequest(
                        "test@gmail.com",
                        "password123"
                );

        User user = User.builder()
                .id(1L)
                .email("test@gmail.com")
                .password("encodedPassword")
                .firstName("Test")
                .lastName("User")
                .role(UserRole.USER)
                .emailVerified(false)
                .build();

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "password123",
                "encodedPassword"
        )).thenReturn(true);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> userService.login(request)
                );

        assertEquals(
                "Please verify your email before logging in",
                exception.getMessage()
        );

        verify(jwtService, never())
                .generateToken(
                        anyLong(),
                        anyString(),
                        anyString()
                );
    }


    // =========================================================
    // 6. RESET PASSWORD
    // =========================================================

    @Test
    void resetPassword_shouldUpdatePassword() {

        ResetPasswordRequest request =
                new ResetPasswordRequest(
                        "test@gmail.com",
                        "123456",
                        "newPassword123"
                );

        User user = User.builder()
                .id(1L)
                .email("test@gmail.com")
                .password("oldPassword")
                .passwordResetOtp("123456")
                .passwordResetOtpExpiry(
                        LocalDateTime.now().plusMinutes(5)
                )
                .role(UserRole.USER)
                .build();

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.encode("newPassword123"))
                .thenReturn("newEncodedPassword");

        userService.resetPassword(request);

        assertEquals(
                "newEncodedPassword",
                user.getPassword()
        );

        assertNull(user.getPasswordResetOtp());
        assertNull(user.getPasswordResetOtpExpiry());

        verify(passwordEncoder, times(1))
                .encode("newPassword123");

        verify(userRepository, times(1))
                .save(user);
    }


    // =========================================================
    // 7. CHANGE PASSWORD
    // =========================================================

    @Test
    void changePassword_shouldUpdatePassword() {

        ChangePasswordRequest request =
                new ChangePasswordRequest(
                        "oldPassword",
                        "newPassword123"
                );

        User user = User.builder()
                .id(1L)
                .email("test@gmail.com")
                .password("encodedOldPassword")
                .role(UserRole.USER)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "oldPassword",
                "encodedOldPassword"
        )).thenReturn(true);

        when(passwordEncoder.encode("newPassword123"))
                .thenReturn("encodedNewPassword");

        userService.changePassword(1L, request);

        assertEquals(
                "encodedNewPassword",
                user.getPassword()
        );

        verify(passwordEncoder, times(1))
                .matches(
                        "oldPassword",
                        "encodedOldPassword"
                );

        verify(passwordEncoder, times(1))
                .encode("newPassword123");

        verify(userRepository, times(1))
                .save(user);
    }


    // =========================================================
    // 8. CHANGE PASSWORD - WRONG CURRENT PASSWORD
    // =========================================================

    @Test
    void changePassword_shouldThrowExceptionForWrongPassword() {

        ChangePasswordRequest request =
                new ChangePasswordRequest(
                        "wrongPassword",
                        "newPassword123"
                );

        User user = User.builder()
                .id(1L)
                .email("test@gmail.com")
                .password("encodedOldPassword")
                .role(UserRole.USER)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "wrongPassword",
                "encodedOldPassword"
        )).thenReturn(false);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> userService.changePassword(
                                1L,
                                request
                        )
                );

        assertEquals(
                "Current password is incorrect",
                exception.getMessage()
        );

        verify(userRepository, never())
                .save(any(User.class));
    }
}