package com.project.fitness.activityservice.dto;

import com.project.fitness.activityservice.model.ActivityType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Activity type is required")
    private ActivityType type;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be greater than 0")
    private Integer duration;

    @PositiveOrZero(message = "Calories cannot be negative")
    private Integer caloriesBurned;

    private LocalDateTime startTime;

    private Map<String, Object> additionalMetrics;
}