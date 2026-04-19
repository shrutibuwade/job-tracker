package com.jobtracker.backend.controller;
import java.util.HashMap;
import com.jobtracker.backend.service.NLPMatcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private NLPMatcherService nlpMatcherService;

    @PostMapping("/match")
    public ResponseEntity<?> matchResume(@RequestBody Map<String, String> request) {
        try {
            String resume = request.get("resume");
            String jobDescription = request.get("jobDescription");
            Map<String, Object> result = nlpMatcherService.match(resume, jobDescription);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Analysis failed: " + e.getMessage());
        }
    }
    @PostMapping("/cover-letter")
    public ResponseEntity<?> generateCoverLetter(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String skills = request.get("skills");
            String bio = request.get("bio");
            String degree = request.get("degree");
            String college = request.get("college");
            String targetRole = request.get("targetRole");
            String jobDescription = request.get("jobDescription");
            String company = request.get("company");
            String experienceLevel = request.get("experienceLevel");

            String coverLetter = buildCoverLetter(
                    name, skills, bio, degree,
                    college, targetRole, jobDescription,
                    company, experienceLevel
            );

            Map<String, String> result = new HashMap<>();
            result.put("coverLetter", coverLetter);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String buildCoverLetter(String name, String skills, String bio,
                                    String degree, String college, String targetRole,
                                    String jobDescription, String company, String experienceLevel) {

        String[] skillList = skills != null ? skills.split(",") : new String[]{};
        String topSkills = skillList.length > 0
                ? String.join(", ", java.util.Arrays.copyOfRange(
                skillList, 0, Math.min(5, skillList.length)))
                : "various technologies";

        return String.format("""
Dear Hiring Manager,

I am writing to express my strong interest in the %s position at %s. As a %s graduate from %s with expertise in %s, I am confident that my skills and passion for technology make me an excellent candidate for this role.

%s

Throughout my academic journey, I have developed strong proficiency in %s. I have worked on real-world projects that have helped me build practical experience in software development, problem-solving, and delivering high-quality solutions.

What excites me most about %s is the opportunity to contribute to innovative products while continuing to grow as a developer. I am particularly drawn to this role because it aligns perfectly with my career goals and technical background.

I am a quick learner, team player, and passionate about writing clean, efficient code. I would love the opportunity to bring my skills and enthusiasm to your team.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to %s.

Warm regards,
%s
            """,
                targetRole != null ? targetRole : "Software Engineer",
                company != null ? company : "your company",
                degree != null ? degree : "Engineering",
                college != null ? college : "a reputed institution",
                topSkills,
                bio != null && !bio.isEmpty() ? bio : "I am a passionate software developer with a strong foundation in computer science and a drive to build impactful solutions.",
                topSkills,
                company != null ? company : "your company",
                company != null ? company : "your organization",
                name != null ? name : "Applicant"
        );
    }
}