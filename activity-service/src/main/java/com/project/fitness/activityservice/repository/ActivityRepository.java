package com.project.fitness.activityservice.repository;

import com.project.fitness.activityservice.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByUserId(Long userId);
}