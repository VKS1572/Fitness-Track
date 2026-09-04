package com.project.fitness.recommendationservice.controller;

import com.project.fitness.recommendationservice.dto.RecommendationResponse;
import com.project.fitness.recommendationservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<RecommendationResponse> getRecommendation(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                recommendationService.getRecommendation(userId)
        );
    }
}