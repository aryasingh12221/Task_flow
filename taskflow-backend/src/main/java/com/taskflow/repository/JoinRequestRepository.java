package com.taskflow.repository;

import com.taskflow.entity.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    List<JoinRequest> findAllByProjectId(Long projectId);
    List<JoinRequest> findAllByProjectIdAndStatus(Long projectId, String status);
    Optional<JoinRequest> findByProjectIdAndUserIdAndStatus(Long projectId, Long userId, String status);
    boolean existsByProjectIdAndUserIdAndStatus(Long projectId, Long userId, String status);
}
