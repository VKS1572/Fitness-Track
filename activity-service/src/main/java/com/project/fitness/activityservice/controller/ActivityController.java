package com.project.fitness.activityservice.controller;

import com.project.fitness.activityservice.dto.ActivityRequest;
import com.project.fitness.activityservice.dto.ActivityResponse;
import com.project.fitness.activityservice.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(
            @Valid @RequestBody ActivityRequest request
    ) {

        ActivityResponse response =
                activityService.createActivity(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByUserId(
            @PathVariable Long userId
    ) {

        List<ActivityResponse> activities =
                activityService.getActivitiesByUserId(userId);

        return ResponseEntity.ok(activities);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable Long id) {

        activityService.deleteActivity(id);

        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponse> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityRequest request) {

        ActivityResponse response =
                activityService.updateActivity(id, request);

        return ResponseEntity.ok(response);
    }
}