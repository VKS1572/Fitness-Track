package com.project.fitness.userservice.dto;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword
) {
}