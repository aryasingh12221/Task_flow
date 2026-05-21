package com.taskflow.service;

import com.taskflow.dto.request.CreateIssueRequest;
import com.taskflow.dto.request.UpdateIssueRequest;
import com.taskflow.dto.response.IssueResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.Issue;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.IssueRepository;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public IssueService(IssueRepository issueRepository, ProjectRepository projectRepository, UserRepository userRepository, ProjectMemberRepository projectMemberRepository) {
        this.issueRepository = issueRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    @Transactional
    public IssueResponse createIssue(Long projectId, CreateIssueRequest req, String reporterEmail) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User reporter = userRepository.findByEmail(reporterEmail).orElseThrow(() -> new ResourceNotFoundException("Reporter not found"));

        long seq = issueRepository.countByProjectId(projectId) + 1;
        String issueKey = project.getKeyCode() + "-" + seq;

        User assignee = null;
        if (req.getAssigneeId() != null) {
            if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, req.getAssigneeId())) {
                throw new ResourceNotFoundException("Assignee is not a project member");
            }
            assignee = userRepository.findById(req.getAssigneeId()).orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
        }

        Issue issue = Issue.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .issueType(req.getIssueType())
                .priority(req.getPriority())
                .status(com.taskflow.enums.IssueStatus.valueOf(req.getStatus()))
                .dueDate(req.getDueDate())
                .assignee(assignee)
                .reporter(reporter)
                .project(project)
                .issueKey(issueKey)
                .build();

        issue = issueRepository.save(issue);
        return toResponse(issue);
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getProjectIssues(Long projectId) {
        List<Issue> issues = issueRepository.findAllByProjectIdOrderByCreatedAtDesc(projectId);
        List<IssueResponse> resp = new ArrayList<>();
        for (Issue i : issues) resp.add(toResponse(i));
        return resp;
    }

    @Transactional(readOnly = true)
    public IssueResponse getIssue(Long id) {
        Issue i = issueRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        return toResponse(i);
    }

    @Transactional
    public IssueResponse updateIssue(Long id, UpdateIssueRequest req) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        if (req.getTitle() != null) issue.setTitle(req.getTitle());
        if (req.getDescription() != null) issue.setDescription(req.getDescription());
        if (req.getIssueType() != null) issue.setIssueType(req.getIssueType());
        if (req.getPriority() != null) issue.setPriority(req.getPriority());
        if (req.getStatus() != null) issue.setStatus(req.getStatus());
        if (req.getDueDate() != null) issue.setDueDate(req.getDueDate());
        if (req.getAssigneeId() != null) {
            if (req.getAssigneeId() == -1L) {
                issue.setAssignee(null);
            } else {
                User u = userRepository.findById(req.getAssigneeId()).orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
                issue.setAssignee(u);
            }
        }
        issue = issueRepository.save(issue);
        return toResponse(issue);
    }

    @Transactional
    public void deleteIssue(Long id, String userEmail) {
        Issue issue = issueRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if ("MEMBER".equalsIgnoreCase(user.getRole())) {
            boolean isOwnTask = (issue.getReporter() != null && issue.getReporter().getId().equals(user.getId()))
                    || (issue.getAssignee() != null && issue.getAssignee().getId().equals(user.getId()));
            if (!isOwnTask) {
                throw new UnauthorizedException("Members cannot delete other people's tasks");
            }
        }
        issueRepository.delete(issue);
    }

    private IssueResponse toResponse(Issue i) {
        UserResponse assignee = i.getAssignee() != null ? new UserResponse(i.getAssignee().getId(), i.getAssignee().getName(), i.getAssignee().getEmail(), i.getAssignee().getAvatarColor()) : null;
        UserResponse reporter = i.getReporter() != null ? new UserResponse(i.getReporter().getId(), i.getReporter().getName(), i.getReporter().getEmail(), i.getReporter().getAvatarColor()) : null;
        IssueResponse r = new IssueResponse(i.getId(), i.getIssueKey(), i.getTitle(), i.getDescription(), i.getIssueType(), i.getPriority(), i.getStatus(), i.getProject().getId(), i.getProject().getName(), i.getProject().getKeyCode(), assignee, reporter, i.getDueDate(), i.getCreatedAt(), i.getUpdatedAt(), (i.getDueDate() != null && i.getDueDate().isBefore(LocalDate.now()) && i.getStatus() != com.taskflow.enums.IssueStatus.DONE));
        return r;
    }
}
