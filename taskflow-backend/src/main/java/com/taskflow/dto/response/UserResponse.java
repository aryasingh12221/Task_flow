package com.taskflow.dto.response;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String avatarColor;
    private String role;
    private String openaiApiKey;

    public UserResponse(Long id, String name, String email, String avatarColor) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatarColor = avatarColor;
    }

    public UserResponse(Long id, String name, String email, String avatarColor, String role, String openaiApiKey) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatarColor = avatarColor;
        this.role = role;
        this.openaiApiKey = openaiApiKey;
    }
}
