package com.project.fitness.recommendationservice;

import com.project.fitness.recommendationservice.client.ActivityClient;
import com.project.fitness.recommendationservice.dto.ActivityResponse;
import com.project.fitness.recommendationservice.dto.RecommendationResponse;
import com.project.fitness.recommendationservice.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private ActivityClient activityClient;

    @InjectMocks
    private RecommendationService recommendationService;


    @Test
    void getRecommendation_whenNoActivities_shouldSuggestWalking() {

        when(activityClient.getUserActivities(1L))
                .thenReturn(Collections.emptyList());

        RecommendationResponse result =
                recommendationService.getRecommendation(1L);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals(
                "Start with regular physical activity.",
                result.getRecommendation()
        );
        assertEquals("WALKING", result.getSuggestedActivity());
        assertEquals(
                "No recent activities found.",
                result.getReason()
        );

        verify(activityClient).getUserActivities(1L);
    }


    @Test
    void getRecommendation_withActivities_shouldCalculateTotals() {

        ActivityResponse activity1 = new ActivityResponse();
        activity1.setDuration(30);
        activity1.setCaloriesBurned(250);
        activity1.setType("RUNNING");

        ActivityResponse activity2 = new ActivityResponse();
        activity2.setDuration(45);
        activity2.setCaloriesBurned(350);
        activity2.setType("RUNNING");

        List<ActivityResponse> activities =
                Arrays.asList(activity1, activity2);

        when(activityClient.getUserActivities(1L))
                .thenReturn(activities);

        RecommendationResponse result =
                recommendationService.getRecommendation(1L);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals(
                "Keep maintaining your fitness routine.",
                result.getRecommendation()
        );
        assertEquals("RUNNING", result.getSuggestedActivity());

        assertEquals(
                "You completed 2 activities with 75 minutes and 600 calories burned.",
                result.getReason()
        );

        verify(activityClient).getUserActivities(1L);
    }


    @Test
    void getRecommendation_withNullDurationAndCalories_shouldTreatThemAsZero() {

        ActivityResponse activity = new ActivityResponse();
        activity.setDuration(null);
        activity.setCaloriesBurned(null);
        activity.setType("CYCLING");

        when(activityClient.getUserActivities(1L))
                .thenReturn(List.of(activity));

        RecommendationResponse result =
                recommendationService.getRecommendation(1L);

        assertNotNull(result);
        assertEquals("CYCLING", result.getSuggestedActivity());
        assertEquals(
                "You completed 1 activities with 0 minutes and 0 calories burned.",
                result.getReason()
        );

        verify(activityClient).getUserActivities(1L);
    }
}