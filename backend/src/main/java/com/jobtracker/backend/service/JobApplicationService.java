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
import java.util.HashMap;
import java.util.Map;

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
    public Map<String, Object> getAdvancedStats(Long userId) {
        List<JobApplication> allJobs = jobApplicationRepository.findByUserId(userId);
        Map<String, Object> stats = new HashMap<>();

        // Basic counts
        long total = allJobs.size();
        long interviews = allJobs.stream().filter(j -> j.getStatus().equals("Interview")).count();
        long offers = allJobs.stream().filter(j -> j.getStatus().equals("Offer")).count();
        long rejected = allJobs.stream().filter(j -> j.getStatus().equals("Rejected")).count();
        long applied = allJobs.stream().filter(j -> j.getStatus().equals("Applied")).count();

        // Response rate (anything beyond Applied)
        double responseRate = total > 0 ? ((double)(total - applied) / total) * 100 : 0;

        // Interview success rate
        double interviewSuccessRate = interviews > 0 ? ((double)offers / interviews) * 100 : 0;

        // Rejection rate
        double rejectionRate = total > 0 ? ((double)rejected / total) * 100 : 0;

        // Weekly stats
        Map<String, Long> weeklyStats = new java.util.LinkedHashMap<>();
        java.time.LocalDate today = java.time.LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            java.time.LocalDate date = today.minusDays(i);
            String dayName = date.getDayOfWeek().toString().substring(0, 3);
            long count = allJobs.stream()
                    .filter(j -> j.getAppliedDate() != null && j.getAppliedDate().equals(date))
                    .count();
            weeklyStats.put(dayName, count);
        }

        // Monthly stats
        Map<String, Long> monthlyStats = new java.util.LinkedHashMap<>();
        for (int i = 5; i >= 0; i--) {
            java.time.LocalDate date = today.minusMonths(i);
            String monthName = date.getMonth().toString().substring(0, 3) + " " + date.getYear();
            long count = allJobs.stream()
                    .filter(j -> j.getAppliedDate() != null
                            && j.getAppliedDate().getMonth().equals(date.getMonth())
                            && j.getAppliedDate().getYear() == date.getYear())
                    .count();
            monthlyStats.put(monthName, count);
        }

        // Top companies applied to
        Map<String, Long> companyStats = allJobs.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        JobApplication::getCompanyName,
                        java.util.stream.Collectors.counting()
                ));

        stats.put("total", total);
        stats.put("interviews", interviews);
        stats.put("offers", offers);
        stats.put("rejected", rejected);
        stats.put("applied", applied);
        stats.put("responseRate", Math.round(responseRate));
        stats.put("interviewSuccessRate", Math.round(interviewSuccessRate));
        stats.put("rejectionRate", Math.round(rejectionRate));
        stats.put("weeklyStats", weeklyStats);
        stats.put("monthlyStats", monthlyStats);
        stats.put("companyStats", companyStats);

        return stats;
    }
}