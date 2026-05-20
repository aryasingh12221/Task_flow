package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JoinRequestResponse {
    private Long id;
    private Long projectId;
    private String projectName;
    private UserResponse user;
    private String status;
    private String createdAt;
}
