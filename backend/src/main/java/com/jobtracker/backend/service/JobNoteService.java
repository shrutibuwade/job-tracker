package com.jobtracker.backend.service;

import com.jobtracker.backend.entity.JobApplication;
import com.jobtracker.backend.entity.JobNote;
import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.repository.JobApplicationRepository;
import com.jobtracker.backend.repository.JobNoteRepository;
import com.jobtracker.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobNoteService {

    @Autowired private JobNoteRepository jobNoteRepository;
    @Autowired private JobApplicationRepository jobApplicationRepository;
    @Autowired private UserRepository userRepository;

    public JobNote addNote(Long jobId, Long userId, JobNote note) {
        JobApplication job = jobApplicationRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        note.setJob(job);
        note.setUser(user);
        return jobNoteRepository.save(note);
    }

    public List<JobNote> getNotes(Long jobId) {
        return jobNoteRepository.findByJobId(jobId);
    }

    public void deleteNote(Long noteId) {
        jobNoteRepository.deleteById(noteId);
    }
}