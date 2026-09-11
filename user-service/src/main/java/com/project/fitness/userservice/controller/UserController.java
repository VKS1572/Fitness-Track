package com.project.fitness.userservice.controller;

import com.project.fitness.userservice.dto.ChangePasswordRequest;
import com.project.fitness.userservice.dto.LoginRequest;
import com.project.fitness.userservice.dto.RegisterRequest;
import com.project.fitness.userservice.dto.ResendOtpRequest;
import com.project.fitness.userservice.dto.UserResponse;
import com.project.fitness.userservice.dto.VerifyEmailRequest;
import com.project.fitness.userservice.model.User;
import com.project.fitness.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.fitness.userservice.dto.ForgotPasswordRequest;
import com.project.fitness.userservice.dto.VerifyResetOtpRequest;
import com.project.fitness.userservice.dto.ResetPasswordRequest;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.project.fitness.userservice.dto.UpdateUserRequest;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.register(request));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request) {

        userService.verifyEmail(request);

        return ResponseEntity.ok(
                "Email verified successfully"
        );
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(
            @Valid @RequestBody ResendOtpRequest request) {

        userService.resendOtp(request);

        return ResponseEntity.ok(
                "Verification OTP sent successfully"
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                userService.login(request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {

        User user =
                userService.updateUser(id, request);

        return ResponseEntity.ok(
                UserResponse.from(user)
        );
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<String> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {

        userService.changePassword(id, request);

        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        userService.forgotPassword(request);

        return ResponseEntity.ok(
                "If an account exists with this email, a reset OTP has been sent."
        );
    }
    @PostMapping("/verify-reset-otp")
    public ResponseEntity<String> verifyResetOtp(
            @Valid @RequestBody VerifyResetOtpRequest request) {

        userService.verifyResetOtp(request);

        return ResponseEntity.ok(
                "OTP verified successfully"
        );
    }
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(request);

        return ResponseEntity.ok(
                "Password reset successfully"
        );
    }
    @PostMapping(
            value = "/{id}/profile-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserResponse> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                userService.uploadProfileImage(
                        id,
                        file
                )
        );
    }
    @GetMapping("/{id}/profile-image")
    public ResponseEntity<byte[]> getProfileImage(
            @PathVariable Long id) {

        byte[] image =
                userService.getProfileImage(id);

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(image);
    }
    @DeleteMapping("/{id}/profile-image")
    public ResponseEntity<UserResponse> removeProfileImage(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.removeProfileImage(id)
        );
    }
}