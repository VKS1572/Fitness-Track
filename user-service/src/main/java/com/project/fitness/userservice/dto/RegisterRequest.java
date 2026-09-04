package com.project.fitness.userservice.dto;

import com.project.fitness.userservice.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        String password,

        @NotBlank
        String firstName,

        @NotBlank
        String lastName,

        UserRole role
) {
}