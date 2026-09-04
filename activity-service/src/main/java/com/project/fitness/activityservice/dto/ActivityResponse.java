package com.project.fitness.activityservice.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.fitness.activityservice.model.Activity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {

    private Long id;

    private Long userId;

    private String type;

    private Integer duration;

    private Integer caloriesBurned;

    private LocalDateTime startTime;

    private Map<String, Object> additionalMetrics;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static ActivityResponse fromEntity(
            Activity activity,
            ObjectMapper objectMapper
    ) {

        Map<String, Object> metrics = null;

        if (activity.getAdditionalMetrics() != null
                && !activity.getAdditionalMetrics().isBlank()) {

            try {
                metrics = objectMapper.readValue(
                        activity.getAdditionalMetrics(),
                        Map.class
                );
            } catch (JsonProcessingException e) {
                throw new RuntimeException(
                        "Failed to parse additional metrics",
                        e
                );
            }
        }

        return ActivityResponse.builder()
                .id(activity.getId())
                .userId(activity.getUserId())
                .type(activity.getType().name())
                .duration(activity.getDuration())
                .caloriesBurned(activity.getCaloriesBurned())
                .startTime(activity.getStartTime())
                .additionalMetrics(metrics)
                .createdAt(activity.getCreatedAt())
                .updatedAt(activity.getUpdatedAt())
                .build();
    }
}