package com.project.fitness.recommendationservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationResponse {

    private Long userId;
    private String recommendation;
    private String suggestedActivity;
    private String reason;
}