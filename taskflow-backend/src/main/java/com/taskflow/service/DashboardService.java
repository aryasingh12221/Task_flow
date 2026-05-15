package com.taskflow.service;

import com.taskflow.dto.response.DashboardResponse;
import com.taskflow.dto.response.IssueResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.Issue;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.enums.IssueStatus;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.IssueRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final IssueRepository issueRepository;

    public DashboardService(UserRepository userRepository, ProjectRepository projectRepository, IssueRepository issueRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.issueRepository = issueRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Project> projects = projectRepository.findAllByMemberUserId(user.getId());
        List<Long> projectIds = projects.stream().map(Project::getId).toList();

        List<Issue> issues = projectIds.isEmpty()
                ? new ArrayList<>()
                : issueRepository.findAll().stream().filter(issue -> projectIds.contains(issue.getProject().getId())).toList();

        long todoCount = issues.stream().filter(i -> i.getStatus() == IssueStatus.TODO).count();
        long inProgressCount = issues.stream().filter(i -> i.getStatus() == IssueStatus.IN_PROGRESS).count();
        long doneCount = issues.stream().filter(i -> i.getStatus() == IssueStatus.DONE).count();
        long overdueCount = issues.stream().filter(i -> i.getDueDate() != null && i.getDueDate().isBefore(LocalDate.now()) && i.getStatus() != IssueStatus.DONE).count();

        List<IssueResponse> overdueIssues = issues.stream()
                .filter(i -> i.getDueDate() != null && i.getDueDate().isBefore(LocalDate.now()) && i.getStatus() != IssueStatus.DONE)
                .sorted(Comparator.comparing(Issue::getDueDate))
                .map(this::toResponse)
                .toList();

        Map<Long, List<Issue>> byAssignee = issues.stream().filter(i -> i.getAssignee() != null).collect(Collectors.groupingBy(i -> i.getAssignee().getId()));
        List<DashboardResponse.IssueByUserResponse> issuesByUser = byAssignee.entrySet().stream().map(entry -> {
            User assignee = entry.getValue().get(0).getAssignee();
            return new DashboardResponse.IssueByUserResponse(assignee.getId(), assignee.getName(), assignee.getAvatarColor(), entry.getValue().size());
        }).toList();

        List<IssueResponse> recentIssues = issues.stream()
                .sorted(Comparator.comparing(Issue::getCreatedAt).reversed())
                .limit(5)
                .map(this::toResponse)
                .toList();

        return new DashboardResponse(projects.size(), issues.size(), todoCount, inProgressCount, doneCount, overdueCount, overdueIssues, issuesByUser, recentIssues);
    }

    private IssueResponse toResponse(Issue i) {
        UserResponse assignee = i.getAssignee() != null ? new UserResponse(i.getAssignee().getId(), i.getAssignee().getName(), i.getAssignee().getEmail(), i.getAssignee().getAvatarColor()) : null;
        UserResponse reporter = i.getReporter() != null ? new UserResponse(i.getReporter().getId(), i.getReporter().getName(), i.getReporter().getEmail(), i.getReporter().getAvatarColor()) : null;
        return new IssueResponse(i.getId(), i.getIssueKey(), i.getTitle(), i.getDescription(), i.getIssueType(), i.getPriority(), i.getStatus(), i.getProject().getId(), i.getProject().getName(), i.getProject().getKeyCode(), assignee, reporter, i.getDueDate(), i.getCreatedAt(), i.getUpdatedAt(), i.getDueDate() != null && i.getDueDate().isBefore(LocalDate.now()) && i.getStatus() != IssueStatus.DONE);
    }
}
