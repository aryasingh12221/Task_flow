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
    private long blockedCount;
    private long pendingCount;
    private long overdueCount;
    private List<IssueResponse> overdueIssues;
    private List<IssueByUserResponse> issuesByUser;
    private List<IssueResponse> recentIssues;
    
    // Advanced features
    private List<ProjectProgressResponse> activeProjects;
    private List<TeamWorkloadResponse> teamWorkloads;
    private ForecastingResponse forecasting;
    private EodReportResponse eodReport;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class IssueByUserResponse {
        private Long userId;
        private String userName;
        private String avatarColor;
        private long count;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ProjectProgressResponse {
        private Long projectId;
        private String name;
        private String keyCode;
        private String avatarColor;
        private long totalTasks;
        private long completedTasks;
        private double progressPercentage;
        private String predictedCompletionDate;
        private long blockerCount;
        private boolean isDelayed;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class TeamWorkloadResponse {
        private Long userId;
        private String userName;
        private String email;
        private String avatarColor;
        private long todoCount;
        private long inProgressCount;
        private long blockedCount;
        private long pendingCount;
        private long completedCount;
        private long totalAssigned;
        private double productivityRatio;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ForecastingResponse {
        private String estimatedGlobalTimeline;
        private double teamCapacityPercentage;
        private double resourceUtilizationRate;
        private List<String> potentialDelays;
        private List<String> potentialBottlenecks;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class EodReportResponse {
        private List<IssueResponse> completedToday;
        private List<IssueResponse> pendingTasks;
        private List<IssueResponse> blockers;
        private String markdownSummary;
    }
}
