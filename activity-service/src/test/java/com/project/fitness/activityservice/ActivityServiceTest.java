package com.project.fitness.activityservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.fitness.activityservice.dto.ActivityRequest;
import com.project.fitness.activityservice.dto.ActivityResponse;
import com.project.fitness.activityservice.exception.ActivityNotFoundException;
import com.project.fitness.activityservice.model.Activity;
import com.project.fitness.activityservice.model.ActivityType;
import com.project.fitness.activityservice.repository.ActivityRepository;
import com.project.fitness.activityservice.service.ActivityService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ActivityService activityService;

    @Test
    void createActivity_shouldSaveActivity() throws Exception {

        ActivityRequest request = ActivityRequest.builder()
                .userId(1L)
                .type(ActivityType.RUNNING)
                .duration(30)
                .caloriesBurned(250)
                .startTime(LocalDateTime.of(2026, 9, 10, 15, 0))
                .additionalMetrics(Map.of("distance", 5))
                .build();

        Activity savedActivity = Activity.builder()
                .id(1L)
                .userId(1L)
                .type(ActivityType.RUNNING)
                .duration(30)
                .caloriesBurned(250)
                .startTime(request.getStartTime())
                .additionalMetrics("{\"distance\":5}")
                .build();

        when(objectMapper.writeValueAsString(any()))
                .thenReturn("{\"distance\":5}");

        when(activityRepository.save(any(Activity.class)))
                .thenReturn(savedActivity);

        ActivityResponse response =
                activityService.createActivity(request);

        assertNotNull(response);

        verify(activityRepository, times(1))
                .save(any(Activity.class));
    }

    @Test
    void deleteActivity_shouldDeleteExistingActivity() {

        Long activityId = 1L;

        when(activityRepository.existsById(activityId))
                .thenReturn(true);

        activityService.deleteActivity(activityId);

        verify(activityRepository, times(1))
                .deleteById(activityId);
    }

    @Test
    void getActivitiesByUserId_shouldCallRepository() {

        Long userId = 1L;

        when(activityRepository.findByUserId(userId))
                .thenReturn(java.util.List.of());

        var result =
                activityService.getActivitiesByUserId(userId);

        assertNotNull(result);

        verify(activityRepository, times(1))
                .findByUserId(userId);
    }
    @Test
    void updateActivity_shouldUpdateExistingActivity() throws Exception {

        Long activityId = 1L;

        Activity existingActivity = Activity.builder()
                .id(activityId)
                .userId(1L)
                .type(ActivityType.RUNNING)
                .duration(20)
                .caloriesBurned(150)
                .build();

        ActivityRequest request = ActivityRequest.builder()
                .userId(1L)
                .type(ActivityType.CYCLING)
                .duration(40)
                .caloriesBurned(300)
                .startTime(LocalDateTime.of(2026, 9, 10, 16, 0))
                .additionalMetrics(Map.of("distance", 10))
                .build();

        Activity updatedActivity = Activity.builder()
                .id(activityId)
                .userId(1L)
                .type(ActivityType.CYCLING)
                .duration(40)
                .caloriesBurned(300)
                .startTime(request.getStartTime())
                .additionalMetrics("{\"distance\":10}")
                .build();

        when(activityRepository.findById(activityId))
                .thenReturn(Optional.of(existingActivity));

        when(objectMapper.writeValueAsString(any()))
                .thenReturn("{\"distance\":10}");

        when(activityRepository.save(any(Activity.class)))
                .thenReturn(updatedActivity);

        ActivityResponse response =
                activityService.updateActivity(activityId, request);

        assertNotNull(response);

        verify(activityRepository, times(1))
                .findById(activityId);

        verify(activityRepository, times(1))
                .save(any(Activity.class));
    }
    @Test
    void deleteActivity_shouldThrowExceptionWhenActivityDoesNotExist() {

        Long activityId = 999L;

        when(activityRepository.existsById(activityId))
                .thenReturn(false);

        assertThrows(
                ActivityNotFoundException.class,
                () -> activityService.deleteActivity(activityId)
        );

        verify(activityRepository, never())
                .deleteById(anyLong());
    }
}