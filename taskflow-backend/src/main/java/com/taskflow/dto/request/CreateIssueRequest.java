package com.taskflow.dto.request;

import com.taskflow.enums.IssuePriority;
import com.taskflow.enums.IssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateIssueRequest {
    @NotBlank
    @Size(max = 500)
    private String title;
    private String status;
    private String description;
    private IssueType issueType = IssueType.TASK;
    private IssuePriority priority = IssuePriority.MEDIUM;
    private LocalDate dueDate;
    private Long assigneeId;
}
