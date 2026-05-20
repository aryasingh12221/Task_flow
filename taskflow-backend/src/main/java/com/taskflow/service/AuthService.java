package com.taskflow.service;

import com.taskflow.dto.request.LoginRequest;
import com.taskflow.dto.request.SignupRequest;
import com.taskflow.dto.response.AuthResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.User;
import com.taskflow.exception.ConflictException;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    private final List<String> AVATAR_COLORS = List.of("#0C66E4","#6E5DC6","#1F845A","#CA3521","#F1A10D","#0055CC","#943D73","#0868AC");

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("Email already in use");
        }

        String requestedRole = "MEMBER";
        if ("SYSTEM_ADMIN".equalsIgnoreCase(req.getRole())) {
            if (!"Admin123".equals(req.getAdminAccessKey())) {
                throw new com.taskflow.exception.UnauthorizedException("Invalid admin access key");
            }
            requestedRole = "SYSTEM_ADMIN";
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .avatarColor(AVATAR_COLORS.get(Math.abs(req.getEmail().hashCode()) % AVATAR_COLORS.size()))
                .role(requestedRole)
                .build();

        user = userRepository.save(user);

        var userDetails = org.springframework.security.core.userdetails.User.withUsername(user.getEmail()).password(user.getPassword()).roles("USER").build();
        var auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String token = tokenProvider.generateToken(auth);

        UserResponse ur = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getAvatarColor(), user.getRole(), user.getOpenaiApiKey());
        return new AuthResponse(token, ur);
    }

    public AuthResponse login(LoginRequest req) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
            String token = tokenProvider.generateToken(authentication);
            var user = userRepository.findByEmail(req.getEmail()).orElseThrow();
            UserResponse ur = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getAvatarColor(), user.getRole(), user.getOpenaiApiKey());
            return new AuthResponse(token, ur);
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }
}
