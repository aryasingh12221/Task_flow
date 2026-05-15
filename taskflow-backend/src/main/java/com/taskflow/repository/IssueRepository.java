package com.taskflow.repository;

import com.taskflow.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findAllByProjectIdOrderByCreatedAtDesc(Long projectId);
    Optional<Issue> findByIssueKey(String issueKey);

    @Query("select max(i.id) from Issue i where i.project.id = :projectId")
    Long findMaxSequenceByProjectId(@Param("projectId") Long projectId);

    @Query("select i from Issue i where i.dueDate < :today and i.status <> com.taskflow.enums.IssueStatus.DONE")
    List<Issue> findOverdueIssues(@Param("today") LocalDate today);

    @Query("select i.assignee.id, count(i) from Issue i where i.project.id = :projectId group by i.assignee.id")
    List<Object[]> countTasksGroupedByAssignee(@Param("projectId") Long projectId);

    long countByProjectId(Long projectId);
}
