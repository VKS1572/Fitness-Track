package com.project.fitness.recommendationservice.service;

import com.project.fitness.recommendationservice.client.ActivityClient;
import com.project.fitness.recommendationservice.dto.ActivityResponse;
import com.project.fitness.recommendationservice.dto.RecommendationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ActivityClient activityClient;

    public RecommendationResponse getRecommendation(Long userId) {

        List<ActivityResponse> activities =
                activityClient.getUserActivities(userId);

        if (activities.isEmpty()) {
            return RecommendationResponse.builder()
                    .userId(userId)
                    .recommendation("Start with regular physical activity.")
                    .suggestedActivity("WALKING")
                    .reason("No recent activities found.")
                    .build();
        }

        int totalDuration = activities.stream()
                .mapToInt(a -> a.getDuration() != null ? a.getDuration() : 0)
                .sum();

        int totalCalories = activities.stream()
                .mapToInt(a -> a.getCaloriesBurned() != null
                        ? a.getCaloriesBurned()
                        : 0)
                .sum();

        String activityType = activities.get(0).getType();

        return RecommendationResponse.builder()
                .userId(userId)
                .recommendation("Keep maintaining your fitness routine.")
                .suggestedActivity(activityType)
                .reason("You completed " + activities.size()
                        + " activities with "
                        + totalDuration + " minutes and "
                        + totalCalories + " calories burned.")
                .build();
    }
}