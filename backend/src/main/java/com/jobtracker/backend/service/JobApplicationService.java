package com.jobtracker.backend.service;
import com.jobtracker.backend.dto.DashboardDTO;
import com.jobtracker.backend.dto.JobApplicationDTO;
import com.jobtracker.backend.dto.UserDTO;
import com.jobtracker.backend.entity.JobApplication;
import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.repository.JobApplicationRepository;
import com.jobtracker.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    private JobApplicationDTO convertToDTO(JobApplication job) {
        JobApplicationDTO dto = new JobApplicationDTO();
        dto.setId(job.getId());
        dto.setJobTitle(job.getJobTitle());
        dto.setCompanyName(job.getCompanyName());
        dto.setStatus(job.getStatus());
        dto.setNotes(job.getNotes());
        dto.setAppliedDate(job.getAppliedDate());

        UserDTO userDTO = new UserDTO();
        userDTO.setId(job.getUser().getId());
        userDTO.setName(job.getUser().getName());
        userDTO.setEmail(job.getUser().getEmail());
        dto.setUser(userDTO);

        return dto;
    }

    public JobApplicationDTO addJob(Long userId, JobApplication job) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        job.setUser(user);
        return convertToDTO(jobApplicationRepository.save(job));
    }

    public List<JobApplicationDTO> getAllJobs(Long userId) {
        return jobApplicationRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public JobApplicationDTO updateJob(Long jobId, JobApplication updatedJob) {
        JobApplication existing = jobApplicationRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));
        existing.setJobTitle(updatedJob.getJobTitle());
        existing.setCompanyName(updatedJob.getCompanyName());
        existing.setStatus(updatedJob.getStatus());
        existing.setNotes(updatedJob.getNotes());
        existing.setAppliedDate(updatedJob.getAppliedDate());
        return convertToDTO(jobApplicationRepository.save(existing));
    }

    public void deleteJob(Long jobId) {
        jobApplicationRepository.deleteById(jobId);
    }

    public List<JobApplicationDTO> filterByStatus(Long userId, String status) {
        return jobApplicationRepository.findByUserIdAndStatus(userId, status)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobApplicationDTO> searchByCompany(Long userId, String companyName) {
        return jobApplicationRepository.findByUserIdAndCompanyNameContaining(userId, companyName)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public DashboardDTO getDashboardStats(Long userId) {
        DashboardDTO stats = new DashboardDTO();
        stats.setTotalApplications((long) jobApplicationRepository.findByUserId(userId).size());
        stats.setTotalInterviews((long) jobApplicationRepository.findByUserIdAndStatus(userId, "Interview").size());
        stats.setTotalOffers((long) jobApplicationRepository.findByUserIdAndStatus(userId, "Offer").size());
        stats.setTotalRejected((long) jobApplicationRepository.findByUserIdAndStatus(userId, "Rejected").size());
        return stats;
    }
}