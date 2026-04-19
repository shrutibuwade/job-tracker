package com.jobtracker.backend.service;

import com.jobtracker.backend.entity.*;
import com.jobtracker.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProfileService {

    @Autowired private EducationRepository educationRepository;
    @Autowired private ExperienceRepository experienceRepository;
    @Autowired private SkillRepository skillRepository;
    @Autowired private CertificationRepository certificationRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private UserRepository userRepository;

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    // Education
    public List<Education> getEducations(Long userId) {
        return educationRepository.findByUserId(userId);
    }
    public Education saveEducation(Long userId, Education education) {
        education.setUser(getUser(userId));
        return educationRepository.save(education);
    }
    public void deleteEducation(Long id) {
        educationRepository.deleteById(id);
    }

    // Experience
    public List<Experience> getExperiences(Long userId) {
        return experienceRepository.findByUserId(userId);
    }
    public Experience saveExperience(Long userId, Experience experience) {
        experience.setUser(getUser(userId));
        return experienceRepository.save(experience);
    }
    public void deleteExperience(Long id) {
        experienceRepository.deleteById(id);
    }

    // Skills
    public List<Skill> getSkills(Long userId) {
        return skillRepository.findByUserId(userId);
    }
    public Skill saveSkill(Long userId, Skill skill) {
        skill.setUser(getUser(userId));
        return skillRepository.save(skill);
    }
    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }

    // Certifications
    public List<Certification> getCertifications(Long userId) {
        return certificationRepository.findByUserId(userId);
    }
    public Certification saveCertification(Long userId, Certification certification) {
        certification.setUser(getUser(userId));
        return certificationRepository.save(certification);
    }
    public void deleteCertification(Long id) {
        certificationRepository.deleteById(id);
    }

    // Projects
    public List<Project> getProjects(Long userId) {
        return projectRepository.findByUserId(userId);
    }
    public Project saveProject(Long userId, Project project) {
        project.setUser(getUser(userId));
        return projectRepository.save(project);
    }
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}