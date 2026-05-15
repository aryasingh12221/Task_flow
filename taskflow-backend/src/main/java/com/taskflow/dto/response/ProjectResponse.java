package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String keyCode;
    private String description;
    private String avatarColor;
    private UserResponse lead;
    private int memberCount;
    private int totalIssues;
    private int doneIssues;
    private String myRole;
    private String createdAt;
}
