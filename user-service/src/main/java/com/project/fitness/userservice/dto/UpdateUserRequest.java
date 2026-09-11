package com.project.fitness.userservice.dto;

public record UpdateUserRequest(
        String firstName,
        String lastName,
        String email
) {
}