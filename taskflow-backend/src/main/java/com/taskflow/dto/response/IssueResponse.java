package com.taskflow.dto.response;

import com.taskflow.enums.IssuePriority;
import com.taskflow.enums.IssueStatus;
import com.taskflow.enums.IssueType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IssueResponse {
    private Long id;
    private String issueKey;
    private String title;
    private String description;
    private IssueType issueType;
    private IssuePriority priority;
    private IssueStatus status;
    private Long projectId;
    private String projectName;
    private String projectKey;
    private UserResponse assignee;
    private UserResponse reporter;
    private LocalDate dueDate;
    private Instant createdAt;
    private Instant updatedAt;
    private boolean overdue;
}
