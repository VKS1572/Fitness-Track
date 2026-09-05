package com.project.fitness.userservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationOtp(
            String toEmail,
            String otp
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject("FitTrack Email Verification");

        message.setText(
                "Welcome to FitTrack!\n\n" +
                        "Your email verification OTP is:\n\n" +
                        otp +
                        "\n\n" +
                        "This OTP is valid for 10 minutes.\n\n" +
                        "If you did not create a FitTrack account, " +
                        "please ignore this email.\n\n" +
                        "— FitTrack Team"
        );

        mailSender.send(message);
    }
    public void sendPasswordResetOtp(
            String toEmail,
            String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "FitTrack Password Reset"
        );

        message.setText(
                "FitTrack Password Reset\n\n" +
                        "Your password reset OTP is:\n\n" +
                        otp +
                        "\n\n" +
                        "This OTP is valid for 10 minutes.\n\n" +
                        "If you did not request a password reset, " +
                        "please ignore this email.\n\n" +
                        "— FitTrack Team"
        );

        mailSender.send(message);
    }
}