package com.taskflow.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserSettingsRequest {
    @Size(max = 100)
    private String name;

    private String password;

    private String openaiApiKey;
}
