package com.aura.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send verification email to user with OTP
     * 
     * @param toEmail  recipient email address
     * @param username recipient username
     * @param otp      6-digit verification code
     */
    public void sendVerificationEmail(String toEmail, String username, String otp) {
        logger.info("📧 Attempting to send verification email to: {} with OTP: {}", toEmail, otp);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Verify Your Aura Account");

            String htmlContent = buildVerificationEmailContent(username, otp);
            helper.setText(htmlContent, true);

            logger.info("📤 Sending email via SMTP...");
            mailSender.send(message);
            logger.info("✅ Verification email sent successfully to: {}", toEmail);

        } catch (MessagingException e) {
            logger.error("❌ Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    /**
     * Build HTML content for verification email with OTP
     * 
     * @param username recipient username
     * @param otp      6-digit verification code
     * @return HTML email content
     */
    private String buildVerificationEmailContent(String username, String otp) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }" +
                "        .content { padding: 20px; background-color: #f9f9f9; }" +
                "        .otp-code { font-size: 36px; font-weight: bold; color: #4CAF50; " +
                "                    letter-spacing: 8px; text-align: center; padding: 20px; " +
                "                    background-color: #f0f0f0; border-radius: 8px; margin: 20px 0; }" +
                "        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>Welcome to Aura!</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <h2>Hello " + username + ",</h2>" +
                "            <p>Thank you for registering with Aura. To complete your registration, " +
                "               please use the verification code below:</p>" +
                "            <div class='otp-code'>" + otp + "</div>" +
                "            <p><strong>This code will expire in 10 minutes.</strong></p>" +
                "            <p>If you did not create an account, please ignore this email.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>&copy; 2025 Aura. All rights reserved.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Send welcome email after successful verification
     * 
     * @param toEmail  recipient email address
     * @param username recipient username
     */
    public void sendWelcomeEmail(String toEmail, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Welcome to Aura - Your Account is Verified!");

            String htmlContent = buildWelcomeEmailContent(username);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    /**
     * Build HTML content for welcome email
     * 
     * @param username recipient username
     * @return HTML email content
     */
    private String buildWelcomeEmailContent(String username) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }" +
                "        .content { padding: 20px; background-color: #f9f9f9; }" +
                "        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>Account Verified!</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <h2>Congratulations " + username + "!</h2>" +
                "            <p>Your email address has been successfully verified.</p>" +
                "            <p>You can now enjoy all the features of Aura.</p>" +
                "            <p>Thank you for joining our community!</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>&copy; 2025 Aura. All rights reserved.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String username, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Reset Your Aura Password");

            String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;

            String htmlContent = buildPasswordResetEmailContent(username, resetLink);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    /**
     * Build HTML content for password reset email
     */
    private String buildPasswordResetEmailContent(String username, String resetLink) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "        .header { background-color: #FF6B6B; color: white; padding: 20px; text-align: center; }" +
                "        .content { padding: 20px; background-color: #f9f9f9; }" +
                "        .button { display: inline-block; padding: 12px 24px; margin: 20px 0; " +
                "                  background-color: #FF6B6B; color: white; text-decoration: none; " +
                "                  border-radius: 5px; }" +
                "        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>Password Reset Request</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <h2>Hello " + username + ",</h2>" +
                "            <p>We received a request to reset your password. Click the button below to reset it:</p>" +
                "            <p style='text-align: center;'>" +
                "                <a href='" + resetLink + "' class='button'>Reset Password</a>" +
                "            </p>" +
                "            <p>Or copy and paste this link into your browser:</p>" +
                "            <p style='word-break: break-all;'>" + resetLink + "</p>" +
                "            <p><strong>This link will expire in 1 hour.</strong></p>" +
                "            <p>If you did not request a password reset, please ignore this email.</p>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>&copy; 2025 Aura. All rights reserved.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Send artist promotion email
     */
    public void sendArtistPromotionEmail(String toEmail, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🎵 Congratulations! You're Now an Artist on Aura");

            String htmlContent = buildArtistPromotionEmailContent(username);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send artist promotion email", e);
        }
    }

    private String buildArtistPromotionEmailContent(String username) {
        return "<!DOCTYPE html>" +
                "<html><head><style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #7C3AED; color: white; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #f9f9f9; }" +
                ".button { display: inline-block; padding: 12px 24px; margin: 20px 0; " +
                "          background-color: #7C3AED; color: white; text-decoration: none; border-radius: 5px; }" +
                "</style></head><body>" +
                "<div class='container'>" +
                "  <div class='header'>" +
                "    <h1>🎵 Welcome to Aura Artists!</h1>" +
                "  </div>" +
                "  <div class='content'>" +
                "    <h2>Congratulations, " + username + "!</h2>" +
                "    <p>You've been promoted to <strong>ARTIST</strong> status on Aura!</p>" +
                "    <p>You can now:</p>" +
                "    <ul>" +
                "      <li>Upload your own songs</li>" +
                "      <li>Manage your music library</li>" +
                "      <li>View your song statistics</li>" +
                "      <li>Connect with listeners</li>" +
                "    </ul>" +
                "    <p style='text-align: center;'>" +
                "      <a href='http://localhost:3000/artist/dashboard' class='button'>Go to Artist Dashboard</a>" +
                "    </p>" +
                "  </div>" +
                "</div>" +
                "</body></html>";
    }

}
