package com.jobtracker.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInterviewReminder(String toEmail, String candidateName,
                                      String company, String role,
                                      String date, String time, String type) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("🎯 Interview Reminder - " + company);
            helper.setText(buildEmailHTML(candidateName, company, role, date, time, type), true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public void sendApplicationUpdate(String toEmail, String candidateName,
                                      String company, String role, String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("📋 Application Update - " + company);
            helper.setText(buildUpdateHTML(candidateName, company, role, status), true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    private String buildEmailHTML(String name, String company, String role,
                                  String date, String time, String type) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 2rem; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Interview Reminder</h1>
                </div>
                <div style="background: #f8fafc; padding: 2rem; border-radius: 0 0 12px 12px;">
                    <p style="font-size: 16px; color: #334155;">Hi <strong>%s</strong>,</p>
                    <p style="color: #64748b;">You have an upcoming interview scheduled!</p>
                    <div style="background: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid #e2e8f0;">
                        <table style="width: 100%%;">
                            <tr><td style="color: #64748b; padding: 8px 0;">Company</td><td style="font-weight: 600; color: #1e293b;">%s</td></tr>
                            <tr><td style="color: #64748b; padding: 8px 0;">Role</td><td style="font-weight: 600; color: #1e293b;">%s</td></tr>
                            <tr><td style="color: #64748b; padding: 8px 0;">Date</td><td style="font-weight: 600; color: #1e293b;">%s</td></tr>
                            <tr><td style="color: #64748b; padding: 8px 0;">Time</td><td style="font-weight: 600; color: #1e293b;">%s</td></tr>
                            <tr><td style="color: #64748b; padding: 8px 0;">Type</td><td style="font-weight: 600; color: #7c3aed;">%s</td></tr>
                        </table>
                    </div>
                    <p style="color: #64748b;">Best of luck! 💪</p>
                    <p style="color: #64748b;">- CareerSync AI Team</p>
                </div>
            </div>
            """.formatted(name, company, role, date, time, type);
    }

    private String buildUpdateHTML(String name, String company,
                                   String role, String status) {
        String statusColor = switch (status) {
            case "Interview" -> "#f59e0b";
            case "Offer" -> "#10b981";
            case "Rejected" -> "#ef4444";
            default -> "#3b82f6";
        };

        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 2rem; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">📋 Application Update</h1>
                </div>
                <div style="background: #f8fafc; padding: 2rem; border-radius: 0 0 12px 12px;">
                    <p style="font-size: 16px; color: #334155;">Hi <strong>%s</strong>,</p>
                    <p style="color: #64748b;">Your application status has been updated!</p>
                    <div style="background: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid #e2e8f0;">
                        <table style="width: 100%%;">
                            <tr><td style="color: #64748b; padding: 8px 0;">Company</td><td style="font-weight: 600; color: #1e293b;">%s</td></tr>
                            <tr><td style="color: #64748b; padding: 8px 0;">Role</td><td style="font-weight: 600; color: #1e293b;">%s</td></tr>
                            <tr><td style="color: #64748b; padding: 8px 0;">Status</td><td style="font-weight: 600; color: %s;">%s</td></tr>
                        </table>
                    </div>
                    <p style="color: #64748b;">Keep going! You're doing great! 💪</p>
                    <p style="color: #64748b;">- CareerSync AI Team</p>
                </div>
            </div>
            """.formatted(name, company, role, statusColor, status);
    }
}