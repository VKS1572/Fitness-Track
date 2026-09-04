package com.project.fitness.userservice.dto;

import com.project.fitness.userservice.model.User;
import com.project.fitness.userservice.model.UserRole;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        UserRole role,
        LocalDateTime createdAt
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}