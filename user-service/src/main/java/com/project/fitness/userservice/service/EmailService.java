
package com.project.fitness.userservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final RestClient restClient = RestClient.create();

    @Value("${BREVO_API_KEY}")
    private String brevoApiKey;

    @Value("${MAIL_FROM}")
    private String mailFrom;

    public void sendVerificationOtp(String toEmail, String otp) {
        String subject = "FitTrack Email Verification";

        String text =
                "Welcome to FitTrack!\n\n" +
                        "Your email verification OTP is:\n\n" +
                        otp + "\n\n" +
                        "This OTP is valid for 10 minutes.\n\n" +
                        "If you did not create a FitTrack account, please ignore this email.\n\n" +
                        "— FitTrack Team";

        sendEmail(toEmail, subject, text);
    }

    public void sendPasswordResetOtp(String toEmail, String otp) {
        String subject = "FitTrack Password Reset";

        String text =
                "FitTrack Password Reset\n\n" +
                        "Your password reset OTP is:\n\n" +
                        otp + "\n\n" +
                        "This OTP is valid for 10 minutes.\n\n" +
                        "If you did not request a password reset, please ignore this email.\n\n" +
                        "— FitTrack Team";

        sendEmail(toEmail, subject, text);
    }

    private void sendEmail(String toEmail, String subject, String text) {

        Map<String, Object> requestBody = Map.of(
                "sender", Map.of(
                        "name", "FitTrack",
                        "email", mailFrom
                ),
                "to", List.of(
                        Map.of("email", toEmail)
                ),
                "subject", subject,
                "textContent", text
        );

        restClient.post()
                .uri("https://api.brevo.com/v3/smtp/email")
                .header("api-key", brevoApiKey)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .toBodilessEntity();
    }
}
