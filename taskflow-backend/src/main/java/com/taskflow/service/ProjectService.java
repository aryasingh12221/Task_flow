package com.taskflow.service;

import com.taskflow.dto.request.CreateProjectRequest;
import com.taskflow.dto.request.AddMemberRequest;
import com.taskflow.dto.response.MemberResponse;
import com.taskflow.dto.response.ProjectDetailResponse;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectMember;
import com.taskflow.entity.User;
import com.taskflow.enums.ProjectRole;
import com.taskflow.exception.ConflictException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, ProjectMemberRepository projectMemberRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
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
        List<Project> projects = projectRepository.findAllByMemberUserId(user.getId());
        List<ProjectResponse> resp = new ArrayList<>();
        for (Project p : projects) {
            UserResponse lead = p.getLead() != null ? new UserResponse(p.getLead().getId(), p.getLead().getName(), p.getLead().getEmail(), p.getLead().getAvatarColor()) : null;
            int members = (int)projectMemberRepository.countByProjectId(p.getId());
            String myRole = projectMemberRepository.findByProjectIdAndUserId(p.getId(), user.getId()).map(member -> member.getRole().name()).orElse(ProjectRole.MEMBER.name());
            resp.add(new ProjectResponse(p.getId(), p.getName(), p.getKeyCode(), p.getDescription(), p.getAvatarColor(), lead, members, 0, 0, myRole, p.getCreatedAt().toString()));
        }
        return resp;
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectDetail(Long projectId, String userEmail) {
        Project project = getProjectById(projectId);
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ProjectMember membership = projectMemberRepository.findByProjectIdAndUserId(projectId, user.getId()).orElseThrow(() -> new UnauthorizedException("You are not a member of this project"));
        if (membership == null) {
            throw new UnauthorizedException("You are not a member of this project");
        }
        return new ProjectDetailResponse(toProjectResponse(project, membership.getRole().name()), mapMembers(projectId));
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
        return new ProjectDetailResponse(toProjectResponse(project, ProjectRole.ADMIN.name()), mapMembers(projectId));
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

    private void requireAdmin(Long projectId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
