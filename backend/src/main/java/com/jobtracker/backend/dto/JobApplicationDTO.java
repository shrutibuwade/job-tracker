package com.jobtracker.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class JobApplicationDTO {
    private Long id;
    private String jobTitle;
    private String companyName;
    private String status;
    private String notes;
    private LocalDate appliedDate;
    private UserDTO user;
}
