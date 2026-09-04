package com.project.fitness.activityservice.exception;

public class ActivityNotFoundException extends RuntimeException {

    public ActivityNotFoundException(Long id) {
        super("Activity not found with id: " + id);
    }
}