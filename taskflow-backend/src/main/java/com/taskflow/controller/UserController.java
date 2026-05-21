package com.taskflow.controller;

import com.taskflow.dto.request.UpdateUserSettingsRequest;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/settings")
    public ResponseEntity<UserResponse> updateSettings(@Valid @RequestBody UpdateUserSettingsRequest req, Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(userService.updateSettings(email, req));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(Authentication auth) {
        String email = auth.getName();
        userService.deleteAccount(email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<java.util.List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
