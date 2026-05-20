package com.taskflow.service;

import com.taskflow.dto.request.UpdateUserSettingsRequest;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.UserRepository;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.IssueRepository;
import com.taskflow.repository.JoinRequestRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final IssueRepository issueRepository;
    private final JoinRequestRepository joinRequestRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, ProjectRepository projectRepository, ProjectMemberRepository projectMemberRepository, IssueRepository issueRepository, JoinRequestRepository joinRequestRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.issueRepository = issueRepository;
        this.joinRequestRepository = joinRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse updateSettings(String email, UpdateUserSettingsRequest req) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (req.getName() != null && !req.getName().isBlank()) {
            user.setName(req.getName());
        }
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        if (req.getOpenaiApiKey() != null) {
            user.setOpenaiApiKey(req.getOpenaiApiKey().isBlank() ? null : req.getOpenaiApiKey());
        }
        user = userRepository.save(user);
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getAvatarColor(), user.getRole(), user.getOpenaiApiKey());
    }

    @Transactional
    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // 1. Delete all project memberships for this user
        projectMemberRepository.deleteAll(projectMemberRepository.findAll().stream().filter(m -> m.getUser().getId().equals(user.getId())).toList());
        
        // 2. Delete all join requests made by this user
        joinRequestRepository.deleteAll(joinRequestRepository.findAll().stream().filter(r -> r.getUser().getId().equals(user.getId())).toList());

        // 3. Nullify assignee on issues
        issueRepository.findAll().stream().filter(i -> i.getAssignee() != null && i.getAssignee().getId().equals(user.getId()))
                .forEach(i -> {
                    i.setAssignee(null);
                    issueRepository.save(i);
                });

        // 4. Nullify reporter on issues
        issueRepository.findAll().stream().filter(i -> i.getReporter() != null && i.getReporter().getId().equals(user.getId()))
                .forEach(i -> {
                    i.setReporter(null);
                    issueRepository.save(i);
                });

        // 5. Delete projects where this user is the lead or creator
        projectRepository.deleteAll(projectRepository.findAll().stream().filter(p -> p.getLead() != null && p.getLead().getId().equals(user.getId())).toList());

        // 6. Delete user
        userRepository.delete(user);
    }
}
