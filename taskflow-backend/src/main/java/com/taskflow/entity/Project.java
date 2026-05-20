package com.taskflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "key_code", nullable = false, unique = true, length = 10)
    private String keyCode;

    @Lob
    private String description;

    @Column(name = "avatar_color", length = 20)
    private String avatarColor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private User lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private User createdBy;

    @Builder.Default
    @Column(name = "is_public", nullable = false)
    private boolean isPublic = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
