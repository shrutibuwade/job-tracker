package com.jobtracker.backend.controller;

import com.jobtracker.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/interview-reminder")
    public ResponseEntity<?> sendInterviewReminder(@RequestBody Map<String, String> request) {
        try {
            emailService.sendInterviewReminder(
                    request.get("email"),
                    request.get("name"),
                    request.get("company"),
                    request.get("role"),
                    request.get("date"),
                    request.get("time"),
                    request.get("type")
            );
            return ResponseEntity.ok("Email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/application-update")
    public ResponseEntity<?> sendApplicationUpdate(@RequestBody Map<String, String> request) {
        try {
            emailService.sendApplicationUpdate(
                    request.get("email"),
                    request.get("name"),
                    request.get("company"),
                    request.get("role"),
                    request.get("status")
            );
            return ResponseEntity.ok("Email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}