package com.taskflow.controller;

import com.taskflow.dto.request.CreateIssueRequest;
import com.taskflow.dto.request.UpdateIssueRequest;
import com.taskflow.dto.response.IssueResponse;
import com.taskflow.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping("/api/projects/{projectId}/issues")
    public ResponseEntity<List<IssueResponse>> getProjectIssues(@PathVariable Long projectId) {
        return ResponseEntity.ok(issueService.getProjectIssues(projectId));
    }

    @PostMapping("/api/projects/{projectId}/issues")
    public ResponseEntity<IssueResponse> createIssue(@PathVariable Long projectId, @Valid @RequestBody CreateIssueRequest req, Authentication auth) {
        IssueResponse resp = issueService.createIssue(projectId, req, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/api/issues/{id}")
    public ResponseEntity<IssueResponse> getIssue(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssue(id));
    }

    @PatchMapping("/api/issues/{id}")
    public ResponseEntity<IssueResponse> updateIssue(@PathVariable Long id, @RequestBody UpdateIssueRequest req) {
        return ResponseEntity.ok(issueService.updateIssue(id, req));
    }

    @DeleteMapping("/api/issues/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id, Authentication auth) {
        issueService.deleteIssue(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
