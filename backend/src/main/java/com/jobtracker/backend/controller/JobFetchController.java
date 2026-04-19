package com.jobtracker.backend.controller;

import com.jobtracker.backend.service.JobFetchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/fetch")
public class JobFetchController {

    @Autowired
    private JobFetchService jobFetchService;

    @PostMapping("/job")
    public ResponseEntity<?> fetchJob(@RequestBody Map<String, String> request) {
        try {
            String url = request.get("url");
            if (url == null || url.isEmpty()) {
                return ResponseEntity.badRequest().body("URL is required!");
            }
            Map<String, String> result = jobFetchService.fetchJobDetails(url);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}