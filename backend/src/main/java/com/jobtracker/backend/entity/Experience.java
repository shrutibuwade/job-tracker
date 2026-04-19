package com.jobtracker.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String company;
    private String role;
    private String location;
    private String startDate;
    private String endDate;
    private Boolean currentlyWorking;

    @Column(columnDefinition = "TEXT")
    private String description;
}