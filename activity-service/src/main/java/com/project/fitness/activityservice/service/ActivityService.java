package com.project.fitness.activityservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.fitness.activityservice.dto.ActivityRequest;
import com.project.fitness.activityservice.dto.ActivityResponse;
import com.project.fitness.activityservice.exception.ActivityNotFoundException;
import com.project.fitness.activityservice.model.Activity;
import com.project.fitness.activityservice.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    private final ObjectMapper objectMapper;


    // =========================
    // CREATE ACTIVITY
    // =========================

    public ActivityResponse createActivity(ActivityRequest request) {

        String metricsJson = null;

        if (request.getAdditionalMetrics() != null) {
            try {
                metricsJson = objectMapper.writeValueAsString(
                        request.getAdditionalMetrics()
                );
            } catch (JsonProcessingException e) {
                throw new RuntimeException(
                        "Failed to convert additional metrics to JSON",
                        e
                );
            }
        }

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(metricsJson)
                .build();

        Activity savedActivity = activityRepository.save(activity);

        return ActivityResponse.fromEntity(
                savedActivity,
                objectMapper
        );
    }


    // =========================
    // GET ACTIVITIES BY USER
    // =========================

    public List<ActivityResponse> getActivitiesByUserId(Long userId) {

        return activityRepository.findByUserId(userId)
                .stream()
                .map(activity ->
                        ActivityResponse.fromEntity(
                                activity,
                                objectMapper
                        )
                )
                .toList();
    }


    // =========================
    // DELETE ACTIVITY
    // =========================

    public void deleteActivity(Long id) {

        if (!activityRepository.existsById(id)) {
            throw new ActivityNotFoundException(id);
        }

        activityRepository.deleteById(id);
    }


    // =========================
    // UPDATE ACTIVITY
    // =========================

    public ActivityResponse updateActivity(
            Long id,
            ActivityRequest request) {

        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException(id));

        activity.setUserId(request.getUserId());
        activity.setType(request.getType());
        activity.setDuration(request.getDuration());
        activity.setCaloriesBurned(request.getCaloriesBurned());
        activity.setStartTime(request.getStartTime());


        // Map -> JSON String
        String metricsJson = null;

        if (request.getAdditionalMetrics() != null) {
            try {
                metricsJson = objectMapper.writeValueAsString(
                        request.getAdditionalMetrics()
                );
            } catch (JsonProcessingException e) {
                throw new RuntimeException(
                        "Failed to convert additional metrics to JSON",
                        e
                );
            }
        }

        activity.setAdditionalMetrics(metricsJson);


        Activity updatedActivity =
                activityRepository.save(activity);


        // Existing method from ActivityResponse
        return ActivityResponse.fromEntity(
                updatedActivity,
                objectMapper
        );
    }
}