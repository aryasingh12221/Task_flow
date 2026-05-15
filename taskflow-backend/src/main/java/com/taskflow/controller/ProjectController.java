package com.taskflow.controller;

import com.taskflow.dto.request.CreateProjectRequest;
import com.taskflow.dto.request.AddMemberRequest;
import com.taskflow.dto.response.ProjectDetailResponse;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(projectService.getMyProjects(email));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest req, Authentication auth) {
        String email = auth.getName();
        ProjectResponse pr = projectService.createProject(req, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(pr);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> getProject(@PathVariable Long projectId, Authentication auth) {
        return ResponseEntity.ok(projectService.getProjectDetail(projectId, auth.getName()));
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectDetailResponse> addMember(@PathVariable Long projectId, @Valid @RequestBody AddMemberRequest req, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.addMember(projectId, req, auth.getName()));
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long projectId, @PathVariable Long userId, Authentication auth) {
        projectService.removeMember(projectId, userId, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId, Authentication auth) {
        projectService.deleteProject(projectId, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
