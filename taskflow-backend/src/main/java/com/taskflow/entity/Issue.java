package com.taskflow.entity;

import com.taskflow.enums.IssuePriority;
import com.taskflow.enums.IssueStatus;
import com.taskflow.enums.IssueType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "issue_key", length = 20, unique = true)
    private String issueKey;

    @Column(nullable = false, length = 500)
    private String title;

    @Lob
    private String description;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private IssueType issueType = IssueType.TASK;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private IssuePriority priority = IssuePriority.MEDIUM;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private IssueStatus status = IssueStatus.TODO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private User reporter;

    private LocalDate dueDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
