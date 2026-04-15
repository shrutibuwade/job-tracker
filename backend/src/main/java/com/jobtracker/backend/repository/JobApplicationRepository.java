package com.jobtracker.backend.repository;

import com.jobtracker.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUserId(Long userId);
    List<JobApplication> findByUserIdAndStatus(Long userId, String status);
    List<JobApplication> findByUserIdAndCompanyNameContaining(Long userId, String companyName);
}