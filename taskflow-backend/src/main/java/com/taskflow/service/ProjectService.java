package com.taskflow.service;

import com.taskflow.dto.request.CreateProjectRequest;
import com.taskflow.dto.request.AddMemberRequest;
import com.taskflow.dto.response.MemberResponse;
import com.taskflow.dto.response.ProjectDetailResponse;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.dto.response.JoinRequestResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectMember;
import com.taskflow.entity.User;
import com.taskflow.entity.JoinRequest;
import com.taskflow.enums.ProjectRole;
import com.taskflow.exception.ConflictException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.repository.JoinRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final JoinRequestRepository joinRequestRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, ProjectMemberRepository projectMemberRepository, JoinRequestRepository joinRequestRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.joinRequestRepository = joinRequestRepository;
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest req, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail).orElseThrow(() -> new ResourceNotFoundException("Creator not found"));
        String baseKey = generateKeyFromName(req.getName());
        String key = baseKey;
        int suffix = 1;
        while (projectRepository.findByKeyCode(key).isPresent()) {
            key = baseKey + suffix;
            suffix++;
        }

        Project project = Project.builder()
                .name(req.getName())
                .description(req.getDescription())
                .keyCode(key)
                .avatarColor(determineColor(key))
                .lead(creator)
                .createdBy(creator)
                .isPublic(req.getIsPublic() != null ? req.getIsPublic() : true)
                .build();

        project = projectRepository.save(project);

        ProjectMember pm = ProjectMember.builder().project(project).user(creator).role(ProjectRole.ADMIN).build();
        projectMemberRepository.save(pm);

        UserResponse leadResp = new UserResponse(creator.getId(), creator.getName(), creator.getEmail(), creator.getAvatarColor());
        return new ProjectResponse(project.getId(), project.getName(), project.getKeyCode(), project.getDescription(), project.getAvatarColor(), leadResp, (int)projectMemberRepository.countByProjectId(project.getId()), 0, 0, ProjectRole.ADMIN.name(), project.getCreatedAt().toString());
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getMyProjects(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Project> projects;
        if ("SYSTEM_ADMIN".equals(user.getRole())) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findAllByMemberUserId(user.getId());
        }
        List<ProjectResponse> resp = new ArrayList<>();
        for (Project p : projects) {
            UserResponse lead = p.getLead() != null ? new UserResponse(p.getLead().getId(), p.getLead().getName(), p.getLead().getEmail(), p.getLead().getAvatarColor()) : null;
            int members = (int)projectMemberRepository.countByProjectId(p.getId());
            String myRole = "SYSTEM_ADMIN".equals(user.getRole())
                ? ProjectRole.ADMIN.name()
                : projectMemberRepository.findByProjectIdAndUserId(p.getId(), user.getId()).map(member -> member.getRole().name()).orElse(ProjectRole.MEMBER.name());
            resp.add(new ProjectResponse(p.getId(), p.getName(), p.getKeyCode(), p.getDescription(), p.getAvatarColor(), lead, members, 0, 0, myRole, p.getCreatedAt().toString()));
        }
        return resp;
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectDetail(Long projectId, String userEmail) {
        Project project = getProjectById(projectId);
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String roleName = ProjectRole.MEMBER.name();
        if ("SYSTEM_ADMIN".equals(user.getRole())) {
            roleName = ProjectRole.ADMIN.name();
        } else {
            ProjectMember membership = projectMemberRepository.findByProjectIdAndUserId(projectId, user.getId())
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this project"));
            roleName = membership.getRole().name();
        }
        return new ProjectDetailResponse(toProjectResponse(project, roleName), mapMembers(projectId));
    }

    @Transactional
    public ProjectDetailResponse addMember(Long projectId, AddMemberRequest req, String userEmail) {
        Project project = getProjectById(projectId);
        requireAdmin(projectId, userEmail);
        User member = userRepository.findByEmail(req.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, member.getId())) {
            throw new ConflictException("User is already a member of this project");
        }
        projectMemberRepository.save(ProjectMember.builder().project(project).user(member).role(ProjectRole.MEMBER).build());
        
        String roleName = ProjectRole.MEMBER.name();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user != null && "SYSTEM_ADMIN".equals(user.getRole())) {
            roleName = ProjectRole.ADMIN.name();
        } else {
            roleName = projectMemberRepository.findByProjectIdAndUserId(projectId, user != null ? user.getId() : 0L)
                .map(m -> m.getRole().name()).orElse(ProjectRole.MEMBER.name());
        }
        return new ProjectDetailResponse(toProjectResponse(project, roleName), mapMembers(projectId));
    }

    @Transactional
    public void removeMember(Long projectId, Long userId, String userEmail) {
        requireAdmin(projectId, userEmail);
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, userId).orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        if (member.getRole() == ProjectRole.ADMIN && projectMemberRepository.findAllByProjectId(projectId).stream().filter(m -> m.getRole() == ProjectRole.ADMIN).count() <= 1) {
            throw new ConflictException("Cannot remove the last admin");
        }
        projectMemberRepository.delete(member);
    }

    @Transactional
    public void deleteProject(Long projectId, String userEmail) {
        requireAdmin(projectId, userEmail);
        projectRepository.deleteById(projectId);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getPublicProjects(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Project> allPublic = projectRepository.findAll().stream()
                .filter(Project::isPublic)
                .filter(p -> !projectMemberRepository.existsByProjectIdAndUserId(p.getId(), user.getId()))
                .toList();

        List<ProjectResponse> resp = new ArrayList<>();
        for (Project p : allPublic) {
            UserResponse lead = p.getLead() != null ? new UserResponse(p.getLead().getId(), p.getLead().getName(), p.getLead().getEmail(), p.getLead().getAvatarColor()) : null;
            int members = (int)projectMemberRepository.countByProjectId(p.getId());
            String requestStatus = joinRequestRepository.findByProjectIdAndUserIdAndStatus(p.getId(), user.getId(), "PENDING")
                    .map(JoinRequest::getStatus).orElse("NONE");
            resp.add(new ProjectResponse(p.getId(), p.getName(), p.getKeyCode(), p.getDescription(), p.getAvatarColor(), lead, members, 0, 0, requestStatus, p.getCreatedAt().toString()));
        }
        return resp;
    }

    @Transactional
    public JoinRequestResponse createJoinRequest(Long projectId, String userEmail) {
        Project project = getProjectById(projectId);
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, user.getId())) {
            throw new ConflictException("You are already a member of this project");
        }

        if (joinRequestRepository.existsByProjectIdAndUserIdAndStatus(projectId, user.getId(), "PENDING")) {
            throw new ConflictException("A join request is already pending");
        }

        JoinRequest req = JoinRequest.builder()
                .project(project)
                .user(user)
                .status("PENDING")
                .build();
        req = joinRequestRepository.save(req);

        UserResponse ur = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getAvatarColor(), user.getRole(), user.getOpenaiApiKey());
        return new JoinRequestResponse(req.getId(), project.getId(), project.getName(), ur, req.getStatus(), req.getCreatedAt().toString());
    }

    @Transactional(readOnly = true)
    public List<JoinRequestResponse> getJoinRequests(Long projectId, String adminEmail) {
        requireAdmin(projectId, adminEmail);
        List<JoinRequest> requests = joinRequestRepository.findAllByProjectIdAndStatus(projectId, "PENDING");
        List<JoinRequestResponse> resp = new ArrayList<>();
        for (JoinRequest req : requests) {
            User u = req.getUser();
            UserResponse ur = new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getAvatarColor(), u.getRole(), u.getOpenaiApiKey());
            resp.add(new JoinRequestResponse(req.getId(), projectId, req.getProject().getName(), ur, req.getStatus(), req.getCreatedAt().toString()));
        }
        return resp;
    }

    @Transactional
    public void processJoinRequest(Long projectId, Long requestId, String status, String adminEmail) {
        requireAdmin(projectId, adminEmail);
        JoinRequest req = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found"));
        
        if (!req.getProject().getId().equals(projectId)) {
            throw new ConflictException("Request does not belong to this project");
        }

        if (!"PENDING".equals(req.getStatus())) {
            throw new ConflictException("Request has already been processed");
        }

        if ("APPROVED".equalsIgnoreCase(status)) {
            req.setStatus("APPROVED");
            if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, req.getUser().getId())) {
                projectMemberRepository.save(ProjectMember.builder()
                        .project(req.getProject())
                        .user(req.getUser())
                        .role(ProjectRole.MEMBER)
                        .build());
            }
        } else {
            req.setStatus("REJECTED");
        }
        joinRequestRepository.save(req);
    }

    private void requireAdmin(Long projectId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if ("SYSTEM_ADMIN".equals(user.getRole())) {
            return;
        }
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, user.getId()).orElseThrow(() -> new UnauthorizedException("You are not a member of this project"));
        if (member.getRole() != ProjectRole.ADMIN) {
            throw new UnauthorizedException("Admin access required");
        }
    }

    private ProjectResponse toProjectResponse(Project p, String myRole) {
        UserResponse lead = p.getLead() != null ? new UserResponse(p.getLead().getId(), p.getLead().getName(), p.getLead().getEmail(), p.getLead().getAvatarColor()) : null;
        int members = (int) projectMemberRepository.countByProjectId(p.getId());
        return new ProjectResponse(p.getId(), p.getName(), p.getKeyCode(), p.getDescription(), p.getAvatarColor(), lead, members, 0, 0, myRole, p.getCreatedAt().toString());
    }

    private List<MemberResponse> mapMembers(Long projectId) {
        List<MemberResponse> members = new ArrayList<>();
        for (ProjectMember pm : projectMemberRepository.findAllByProjectId(projectId)) {
            User u = pm.getUser();
            members.add(new MemberResponse(pm.getId(), new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getAvatarColor()), pm.getRole(), pm.getJoinedAt()));
        }
        return members;
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    private String generateKeyFromName(String name) {
        String[] parts = name.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (!p.isBlank()) sb.append(Character.toUpperCase(p.charAt(0)));
            if (sb.length() >= 5) break;
        }
        if (sb.length() == 0) sb.append("PRJ");
        return sb.toString();
    }

    private String determineColor(String key) {
        String[] colors = new String[]{"#0C66E4","#6E5DC6","#1F845A","#CA3521","#F1A10D","#0055CC","#943D73","#0868AC"};
        int idx = Math.abs(key.hashCode()) % colors.length;
        return colors[idx];
    }
}
