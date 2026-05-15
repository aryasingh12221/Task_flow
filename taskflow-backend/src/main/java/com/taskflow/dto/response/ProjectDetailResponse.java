package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProjectDetailResponse {
    private ProjectResponse project;
    private List<MemberResponse> members;
}
