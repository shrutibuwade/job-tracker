package com.jobtracker.backend.controller;

import com.jobtracker.backend.entity.JobNote;
import com.jobtracker.backend.service.JobNoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class JobNoteController {

    @Autowired
    private JobNoteService jobNoteService;

    @PostMapping("/{jobId}/{userId}")
    public ResponseEntity<?> addNote(@PathVariable Long jobId,
                                     @PathVariable Long userId,
                                     @RequestBody JobNote note) {
        try {
            JobNote saved = jobNoteService.addNote(jobId, userId, note);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<List<JobNote>> getNotes(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobNoteService.getNotes(jobId));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable Long noteId) {
        try {
            jobNoteService.deleteNote(noteId);
            return ResponseEntity.ok("Note deleted!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}