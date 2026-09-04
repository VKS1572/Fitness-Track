package com.project.fitness.recommendationservice.client;

import com.project.fitness.recommendationservice.dto.ActivityResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
public class ActivityClient {

    private final RestTemplate restTemplate;

    public ActivityClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<ActivityResponse> getUserActivities(Long userId) {

        ActivityResponse[] activities = restTemplate.getForObject(
                "http://ACTIVITY-SERVICE/api/activities/user/{userId}",
                ActivityResponse[].class,
                userId
        );

        return activities != null
                ? Arrays.asList(activities)
                : List.of();
    }
}