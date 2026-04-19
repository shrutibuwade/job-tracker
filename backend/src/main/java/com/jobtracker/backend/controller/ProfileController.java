package com.jobtracker.backend.controller;

import com.jobtracker.backend.entity.*;
import com.jobtracker.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // Education
    @GetMapping("/{userId}/education")
    public ResponseEntity<?> getEducations(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getEducations(userId));
    }

    @PostMapping("/{userId}/education")
    public ResponseEntity<?> saveEducation(@PathVariable Long userId,
                                           @RequestBody Education education) {
        try {
            return ResponseEntity.ok(profileService.saveEducation(userId, education));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<?> deleteEducation(@PathVariable Long id) {
        try {
            profileService.deleteEducation(id);
            return ResponseEntity.ok("Deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Experience
    @GetMapping("/{userId}/experience")
    public ResponseEntity<?> getExperiences(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getExperiences(userId));
    }

    @PostMapping("/{userId}/experience")
    public ResponseEntity<?> saveExperience(@PathVariable Long userId,
                                            @RequestBody Experience experience) {
        try {
            return ResponseEntity.ok(profileService.saveExperience(userId, experience));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long id) {
        try {
            profileService.deleteExperience(id);
            return ResponseEntity.ok("Deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Skills
    @GetMapping("/{userId}/skills")
    public ResponseEntity<?> getSkills(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getSkills(userId));
    }

    @PostMapping("/{userId}/skills")
    public ResponseEntity<?> saveSkill(@PathVariable Long userId,
                                       @RequestBody Skill skill) {
        try {
            return ResponseEntity.ok(profileService.saveSkill(userId, skill));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        try {
            profileService.deleteSkill(id);
            return ResponseEntity.ok("Deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Certifications
    @GetMapping("/{userId}/certifications")
    public ResponseEntity<?> getCertifications(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getCertifications(userId));
    }

    @PostMapping("/{userId}/certifications")
    public ResponseEntity<?> saveCertification(@PathVariable Long userId,
                                               @RequestBody Certification certification) {
        try {
            return ResponseEntity.ok(profileService.saveCertification(userId, certification));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/certifications/{id}")
    public ResponseEntity<?> deleteCertification(@PathVariable Long id) {
        try {
            profileService.deleteCertification(id);
            return ResponseEntity.ok("Deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Projects
    @GetMapping("/{userId}/projects")
    public ResponseEntity<?> getProjects(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getProjects(userId));
    }

    @PostMapping("/{userId}/projects")
    public ResponseEntity<?> saveProject(@PathVariable Long userId,
                                         @RequestBody Project project) {
        try {
            return ResponseEntity.ok(profileService.saveProject(userId, project));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            profileService.deleteProject(id);
            return ResponseEntity.ok("Deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}