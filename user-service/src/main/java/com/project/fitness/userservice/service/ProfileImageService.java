package com.project.fitness.userservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class ProfileImageService {

    private final Path uploadDirectory;

    public ProfileImageService(
            @Value("${profile.image.upload-dir:uploads/profile}") String uploadDir) {

        this.uploadDirectory =
                Paths.get(uploadDir)
                        .toAbsolutePath()
                        .normalize();

        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Unable to create profile image directory",
                    e
            );
        }
    }

    public String saveImage(
            MultipartFile file,
            Long userId) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Please select an image"
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null ||
                !contentType.startsWith("image/")) {

            throw new RuntimeException(
                    "Only image files are allowed"
            );
        }

        long maxSize =
                5 * 1024 * 1024;

        if (file.getSize() > maxSize) {

            throw new RuntimeException(
                    "Image size must be less than 5 MB"
            );
        }

        String originalName =
                file.getOriginalFilename();

        String extension = "";

        if (originalName != null &&
                originalName.contains(".")) {

            extension =
                    originalName.substring(
                            originalName.lastIndexOf(".")
                    );
        }

        String fileName =
                "user_" +
                        userId +
                        "_" +
                        UUID.randomUUID() +
                        extension;

        Path target =
                uploadDirectory.resolve(fileName);

        try {

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to save profile image",
                    e
            );
        }

        return fileName;
    }

    public byte[] getImage(
            String fileName) {

        try {

            Path file =
                    uploadDirectory
                            .resolve(fileName)
                            .normalize();

            if (!file.startsWith(uploadDirectory)) {
                throw new RuntimeException(
                        "Invalid image path"
                );
            }

            if (!Files.exists(file)) {
                throw new RuntimeException(
                        "Profile image not found"
                );
            }

            return Files.readAllBytes(file);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to read profile image",
                    e
            );
        }
    }

    public void deleteImage(
            String fileName) {

        if (fileName == null ||
                fileName.isBlank()) {
            return;
        }

        try {

            Path file =
                    uploadDirectory
                            .resolve(fileName)
                            .normalize();

            if (file.startsWith(uploadDirectory)) {
                Files.deleteIfExists(file);
            }

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to delete profile image",
                    e
            );
        }
    }
}