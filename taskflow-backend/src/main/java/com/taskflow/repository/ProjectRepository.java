package com.taskflow.repository;

import com.taskflow.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByKeyCode(String keyCode);

    @Query("select p from Project p join ProjectMember m on p.id = m.project.id where m.user.id = :userId")
    List<Project> findAllByMemberUserId(@Param("userId") Long userId);
}
