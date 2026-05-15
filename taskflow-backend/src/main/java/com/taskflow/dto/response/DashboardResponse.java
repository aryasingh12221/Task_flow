package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DashboardResponse {
    private long totalProjects;
    private long totalIssues;
    private long todoCount;
    private long inProgressCount;
    private long doneCount;
    private long overdueCount;
    private List<IssueResponse> overdueIssues;
    private List<IssueByUserResponse> issuesByUser;
    private List<IssueResponse> recentIssues;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class IssueByUserResponse {
        private Long userId;
        private String userName;
        private String avatarColor;
        private long count;
    }
}
