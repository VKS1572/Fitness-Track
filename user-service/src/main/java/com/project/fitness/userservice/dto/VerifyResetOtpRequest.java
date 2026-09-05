package com.project.fitness.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyResetOtpRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        String otp
) {
}