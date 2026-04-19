package com.jobtracker.backend.repository;

import com.jobtracker.backend.entity.JobNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobNoteRepository extends JpaRepository<JobNote, Long> {
    List<JobNote> findByJobId(Long jobId);
    List<JobNote> findByUserIdAndReminderSentFalse(Long userId);
}