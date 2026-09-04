package com.project.fitness.userservice.controller;

import com.project.fitness.userservice.dto.ChangePasswordRequest;
import com.project.fitness.userservice.dto.LoginRequest;
import com.project.fitness.userservice.dto.RegisterRequest;
import com.project.fitness.userservice.dto.UserResponse;
import com.project.fitness.userservice.model.User;
import com.project.fitness.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id) {

        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        User user = userService.updateUser(id, updatedUser);

        return ResponseEntity.ok(UserResponse.from(user));
    }
    @PutMapping("/{id}/password")
    public ResponseEntity<String> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {

        userService.changePassword(id, request);

        return ResponseEntity.ok("Password changed successfully");
    }
}