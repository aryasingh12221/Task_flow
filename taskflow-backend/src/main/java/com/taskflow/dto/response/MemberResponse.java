package com.taskflow.dto.response;

import com.taskflow.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class MemberResponse {
    private Long id;
    private UserResponse user;
    private ProjectRole role;
    private Instant joinedAt;
}
