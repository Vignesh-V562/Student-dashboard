package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.dto.JwtResponse;
import com.student.dashboard.server.dto.LoginRequest;
import com.student.dashboard.server.security.JwtUtils;
import com.student.dashboard.server.security.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final JwtUtils jwtUtils;
        private final com.student.dashboard.server.repository.UserRepository userRepository;
        private final org.springframework.security.crypto.password.PasswordEncoder encoder;

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(
                        @Valid @RequestBody LoginRequest loginRequest) {
                // ... (existing code handles login)
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateJwtToken(authentication);

                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                List<String> roles = userDetails.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList());

                JwtResponse jwtResponse = new JwtResponse(
                                jwt,
                                userDetails.getId(),
                                userDetails.getUsername(),
                                userDetails.getEmail(),
                                roles);

                return ResponseEntity.ok(ApiResponse.success(jwtResponse, "Login successful"));
        }

        @SuppressWarnings("null")
        @GetMapping("/me")
        public ResponseEntity<ApiResponse<com.student.dashboard.server.dto.UserProfileDTO>> getCurrentUser(
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {
                com.student.dashboard.server.entity.User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                com.student.dashboard.server.dto.UserProfileDTO profile = com.student.dashboard.server.dto.UserProfileDTO
                                .builder()
                                .uuid(user.getUuid())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .build();
                return ResponseEntity.ok(ApiResponse.success(profile, "Profile retrieved successfully"));
        }

        @PostMapping("/signup")
        public ResponseEntity<ApiResponse<?>> registerUser(
                        @Valid @RequestBody com.student.dashboard.server.dto.SignupRequest signUpRequest) {
                if (userRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
                        return ResponseEntity.badRequest().body(ApiResponse.error("Error: Username is already taken!"));
                }

                if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().body(ApiResponse.error("Error: Email is already in use!"));
                }

                // Create new user's account
                com.student.dashboard.server.entity.User user = com.student.dashboard.server.entity.User.builder()
                                .username(signUpRequest.getUsername())
                                .email(signUpRequest.getEmail())
                                .passwordHash(encoder.encode(signUpRequest.getPassword()))
                                .role(signUpRequest.getRole() != null && signUpRequest.getRole().equalsIgnoreCase("TEACHER") ? com.student.dashboard.server.entity.enums.UserRole.TEACHER : com.student.dashboard.server.entity.enums.UserRole.STUDENT)
                                .active(true)
                                .build();

                userRepository.save(user);

                return ResponseEntity.ok(ApiResponse.success(null, "User registered successfully!"));
        }
}
