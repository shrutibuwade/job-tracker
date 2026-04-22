package com.jobtracker.backend.controller;
import java.util.HashMap;
import com.jobtracker.backend.service.NLPMatcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

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
    @PostMapping("/interview-prep")
    public ResponseEntity<?> generateInterviewQuestions(@RequestBody Map<String, String> request) {
        try {
            String role = request.get("role");
            String company = request.get("company");
            String level = request.get("level");

            List<Map<String, String>> questions = generateQuestions(role, company, level);

            Map<String, Object> result = new HashMap<>();
            result.put("questions", questions);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private List<Map<String, String>> generateQuestions(String role, String company, String level) {
        List<Map<String, String>> questions = new ArrayList<>();

        // DSA Questions
        String[][] dsaQuestions = {
                {"What is the time complexity of binary search?", "O(log n) — it divides search space in half each time.", "DSA"},
                {"Explain the difference between Stack and Queue.", "Stack is LIFO (Last In First Out), Queue is FIFO (First In First Out).", "DSA"},
                {"What is dynamic programming?", "Breaking complex problems into simpler subproblems and storing results to avoid recomputation.", "DSA"},
                {"How does HashMap work internally in Java?", "HashMap uses array of buckets. Key's hashCode determines bucket index. Collision handled by LinkedList/TreeNode.", "DSA"},
                {"What is the difference between BFS and DFS?", "BFS uses Queue, explores level by level. DFS uses Stack/Recursion, explores depth first.", "DSA"},
                {"What is the time complexity of quicksort?", "Average O(n log n), Worst case O(n²) when pivot is always smallest/largest.", "DSA"}
        };

        // Java Questions
        String[][] javaQuestions = {
                {"What is the difference between == and equals() in Java?", "== compares object references (memory address). equals() compares object content/values.", "Java"},
                {"Explain OOP concepts.", "4 pillars: Encapsulation (data hiding), Inheritance (reuse), Polymorphism (many forms), Abstraction (hiding complexity).", "Java"},
                {"What is the difference between ArrayList and LinkedList?", "ArrayList uses dynamic array, O(1) access. LinkedList uses doubly linked list, O(1) insert/delete.", "Java"},
                {"What are Java 8 features?", "Lambda expressions, Stream API, Optional, Default methods, Method references, Date/Time API.", "Java"},
                {"What is multithreading?", "Running multiple threads simultaneously. Java supports via Thread class, Runnable interface, ExecutorService.", "Java"}
        };

        // Spring Boot Questions
        String[][] springQuestions = {
                {"What is dependency injection?", "Design pattern where objects receive dependencies from external source rather than creating them. Spring uses IoC container.", "Spring Boot"},
                {"What is the difference between @Component, @Service, @Repository?", "All are Spring beans. @Service for business logic, @Repository for DB layer, @Component for generic beans.", "Spring Boot"},
                {"What is REST API?", "Architectural style using HTTP methods (GET, POST, PUT, DELETE) for stateless client-server communication.", "Spring Boot"},
                {"What is JPA and Hibernate?", "JPA is specification for ORM. Hibernate is implementation. Maps Java objects to database tables.", "Spring Boot"}
        };

        // HR Questions
        String[][] hrQuestions = {
                {"Tell me about yourself.", "Structure: Current status → Education → Projects/Experience → Why this company. Keep it 2 minutes.", "HR"},
                {"Why do you want to join " + company + "?", "Research the company. Talk about their products, culture, tech stack and how it aligns with your goals.", "HR"},
                {"What are your strengths and weaknesses?", "Strength: Be specific with example. Weakness: Choose one you're actively improving.", "HR"},
                {"Where do you see yourself in 5 years?", "Show ambition but align with company growth. Focus on skills you want to develop.", "HR"},
                {"Why should we hire you?", "Highlight unique skills, projects, problem-solving ability. Connect your skills to their needs.", "HR"}
        };

        // Add all questions
        for (String[] q : dsaQuestions) {
            Map<String, String> qMap = new HashMap<>();
            qMap.put("question", q[0]);
            qMap.put("answer", q[1]);
            qMap.put("category", q[2]);
            questions.add(qMap);
        }
        for (String[] q : javaQuestions) {
            Map<String, String> qMap = new HashMap<>();
            qMap.put("question", q[0]);
            qMap.put("answer", q[1]);
            qMap.put("category", q[2]);
            questions.add(qMap);
        }
        for (String[] q : springQuestions) {
            Map<String, String> qMap = new HashMap<>();
            qMap.put("question", q[0]);
            qMap.put("answer", q[1]);
            qMap.put("category", q[2]);
            questions.add(qMap);
        }
        for (String[] q : hrQuestions) {
            Map<String, String> qMap = new HashMap<>();
            qMap.put("question", q[0]);
            qMap.put("answer", q[1]);
            qMap.put("category", q[2]);
            questions.add(qMap);
        }

        return questions;
    }
}