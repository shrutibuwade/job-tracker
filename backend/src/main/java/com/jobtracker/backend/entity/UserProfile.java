package com.jobtracker.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String phone;
    private String linkedin;
    private String github;
    private String portfolio;

    @Column(columnDefinition = "TEXT")
    private String bio;

    // Education
    private String degree;
    private String college;
    private String graduationYear;
    private String cgpa;

    @Column(columnDefinition = "TEXT")
    private String certifications;

    // Career
    @Column(columnDefinition = "TEXT")
    private String skills;

    private String targetRole;

    @Column(columnDefinition = "TEXT")
    private String targetCompanies;

    private String expectedSalary;
    private String experienceLevel;
}