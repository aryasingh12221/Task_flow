package com.taskflow.dto.request;

import com.taskflow.enums.IssuePriority;
import com.taskflow.enums.IssueStatus;
import com.taskflow.enums.IssueType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateIssueRequest {
    private String title;
    private String description;
    private IssueType issueType;
    private IssuePriority priority;
    private IssueStatus status;
    private LocalDate dueDate;
    private Long assigneeId; // -1 for unassign
}
