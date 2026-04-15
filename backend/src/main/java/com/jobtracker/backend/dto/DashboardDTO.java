package com.jobtracker.backend.dto;

import lombok.Data;

@Data
public class DashboardDTO {
    private Long totalApplications;
    private Long totalInterviews;
    private Long totalOffers;
    private Long totalRejected;
}