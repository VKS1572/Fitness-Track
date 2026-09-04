package com.project.fitness.userservice.service;

import com.project.fitness.userservice.dto.ChangePasswordRequest;
import com.project.fitness.userservice.dto.LoginRequest;
import com.project.fitness.userservice.dto.LoginResponse;
import com.project.fitness.userservice.dto.RegisterRequest;
import com.project.fitness.userservice.dto.UserResponse;
import com.project.fitness.userservice.model.User;
import com.project.fitness.userservice.model.UserRole;
import com.project.fitness.userservice.repository.UserRepository;
import com.project.fitness.userservice.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role(request.role() != null ? request.role() : UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);

        return UserResponse.from(savedUser);
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

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

    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return UserResponse.from(user);
    }
    public User updateUser(Long id, User updatedUser) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());

        return userRepository.save(user);
    }
    public void changePassword(Long id, ChangePasswordRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                request.currentPassword(),
                user.getPassword())) {

            throw new RuntimeException("Current password is incorrect");
        }

        if (request.newPassword() == null ||
                request.newPassword().length() < 6) {

            throw new RuntimeException(
                    "New password must be at least 6 characters");
        }

        user.setPassword(
                passwordEncoder.encode(request.newPassword())
        );

        userRepository.save(user);
    }
}