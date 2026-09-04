package com.project.fitness.recommendationservice.dto;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {

    private Long id;
    private Long userId;
    private String type;
    private Integer duration;
    private Integer caloriesBurned;
    private String startTime;
    private Map<String, Object> additionalMetrics;
}