package com.jobtracker.backend.controller;
import com.jobtracker.backend.dto.DashboardDTO;
import com.jobtracker.backend.dto.JobApplicationDTO;
import com.jobtracker.backend.entity.JobApplication;
import com.jobtracker.backend.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> addJob(@PathVariable Long userId,
                                    @RequestBody JobApplication job) {
        try {
            JobApplicationDTO saved = jobApplicationService.addJob(userId, job);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<JobApplicationDTO>> getAllJobs(@PathVariable Long userId) {
        return ResponseEntity.ok(jobApplicationService.getAllJobs(userId));
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<?> updateJob(@PathVariable Long jobId,
                                       @RequestBody JobApplication job) {
        try {
            JobApplicationDTO updated = jobApplicationService.updateJob(jobId, job);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId) {
        try {
            jobApplicationService.deleteJob(jobId);
            return ResponseEntity.ok("Job deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}/filter")
    public ResponseEntity<List<JobApplicationDTO>> filterByStatus(
            @PathVariable Long userId,
            @RequestParam String status) {
        return ResponseEntity.ok(jobApplicationService.filterByStatus(userId, status));
    }

    @GetMapping("/{userId}/search")
    public ResponseEntity<List<JobApplicationDTO>> searchByCompany(
            @PathVariable Long userId,
            @RequestParam String companyName) {
        return ResponseEntity.ok(jobApplicationService.searchByCompany(userId, companyName));
    }
    @GetMapping("/{userId}/dashboard")
    public ResponseEntity<?> getDashboardStats(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(jobApplicationService.getDashboardStats(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{userId}/advanced-stats")
    public ResponseEntity<?> getAdvancedStats(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(jobApplicationService.getAdvancedStats(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}