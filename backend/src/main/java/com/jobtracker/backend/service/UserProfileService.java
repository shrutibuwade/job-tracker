package com.jobtracker.backend.service;

import com.jobtracker.backend.entity.User;
import com.jobtracker.backend.entity.UserProfile;
import com.jobtracker.backend.repository.UserProfileRepository;
import com.jobtracker.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public UserProfile getProfile(Long userId) {
        return userProfileRepository.findByUserId(userId)
                .orElse(new UserProfile());
    }

    public UserProfile saveProfile(Long userId, UserProfile profile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        UserProfile existing = userProfileRepository
                .findByUserId(userId)
                .orElse(new UserProfile());

        existing.setUser(user);
        existing.setPhone(profile.getPhone());
        existing.setLinkedin(profile.getLinkedin());
        existing.setGithub(profile.getGithub());
        existing.setPortfolio(profile.getPortfolio());
        existing.setBio(profile.getBio());
        existing.setDegree(profile.getDegree());
        existing.setCollege(profile.getCollege());
        existing.setGraduationYear(profile.getGraduationYear());
        existing.setCgpa(profile.getCgpa());
        existing.setCertifications(profile.getCertifications());
        existing.setSkills(profile.getSkills());
        existing.setTargetRole(profile.getTargetRole());
        existing.setTargetCompanies(profile.getTargetCompanies());
        existing.setExpectedSalary(profile.getExpectedSalary());
        existing.setExperienceLevel(profile.getExperienceLevel());

        return userProfileRepository.save(existing);
    }
}