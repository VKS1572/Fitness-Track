package com.project.fitness.notificationservice;

import com.project.fitness.notificationservice.entity.Notification;
import com.project.fitness.notificationservice.repository.NotificationRepository;
import com.project.fitness.notificationservice.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;


    @Test
    void getUserNotifications_shouldReturnNotifications() {

        Notification notification1 = new Notification();
        notification1.setId(1L);
        notification1.setUserId(1L);
        notification1.setTitle("Workout Reminder");
        notification1.setMessage("Time for your workout");
        notification1.setRead(false);

        Notification notification2 = new Notification();
        notification2.setId(2L);
        notification2.setUserId(1L);
        notification2.setTitle("Workout Completed");
        notification2.setMessage("Great job!");
        notification2.setRead(true);

        List<Notification> notifications =
                Arrays.asList(notification1, notification2);

        when(notificationRepository
                .findByUserIdOrderByCreatedAtDesc(1L))
                .thenReturn(notifications);

        List<Notification> result =
                notificationService.getUserNotifications(1L);

        assertEquals(2, result.size());
        assertEquals("Workout Reminder", result.get(0).getTitle());

        verify(notificationRepository)
                .findByUserIdOrderByCreatedAtDesc(1L);
    }


    @Test
    void createNotification_shouldSaveNotification() {

        Notification savedNotification = new Notification();
        savedNotification.setId(1L);
        savedNotification.setUserId(1L);
        savedNotification.setTitle("Test Notification");
        savedNotification.setMessage("Testing notification");
        savedNotification.setRead(false);

        when(notificationRepository.save(any(Notification.class)))
                .thenReturn(savedNotification);

        Notification result =
                notificationService.createNotification(
                        1L,
                        "Test Notification",
                        "Testing notification"
                );

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
        assertEquals("Test Notification", result.getTitle());
        assertEquals("Testing notification", result.getMessage());
        assertFalse(result.isRead());

        verify(notificationRepository).save(any(Notification.class));
    }


    @Test
    void markAsRead_shouldMarkNotificationAsRead() {

        Notification notification = new Notification();

        notification.setId(1L);
        notification.setUserId(1L);
        notification.setTitle("Test");
        notification.setMessage("Test message");
        notification.setRead(false);

        when(notificationRepository.findById(1L))
                .thenReturn(java.util.Optional.of(notification));

        when(notificationRepository.save(any(Notification.class)))
                .thenReturn(notification);

        Notification result =
                notificationService.markAsRead(1L);

        assertTrue(result.isRead());

        verify(notificationRepository).findById(1L);
        verify(notificationRepository).save(notification);
    }


    @Test
    void markAllAsRead_shouldMarkAllNotificationsAsRead() {

        Notification notification1 = new Notification();
        notification1.setId(1L);
        notification1.setUserId(1L);
        notification1.setRead(false);

        Notification notification2 = new Notification();
        notification2.setId(2L);
        notification2.setUserId(1L);
        notification2.setRead(false);

        List<Notification> notifications =
                Arrays.asList(notification1, notification2);

        when(notificationRepository
                .findByUserIdOrderByCreatedAtDesc(1L))
                .thenReturn(notifications);

        notificationService.markAllAsRead(1L);

        assertTrue(notification1.isRead());
        assertTrue(notification2.isRead());

        verify(notificationRepository)
                .findByUserIdOrderByCreatedAtDesc(1L);

        verify(notificationRepository)
                .saveAll(notifications);
    }


    @Test
    void deleteNotification_shouldDeleteExistingNotification() {

        when(notificationRepository.existsById(1L))
                .thenReturn(true);

        notificationService.deleteNotification(1L);

        verify(notificationRepository)
                .existsById(1L);

        verify(notificationRepository)
                .deleteById(1L);
    }
}