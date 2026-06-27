package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.dto.UserProfileDTO;
import com.student.dashboard.server.entity.enums.UserRole;
import com.student.dashboard.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/roster")
@RequiredArgsConstructor
public class StudentRosterController {
    private final UserRepository userRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserProfileDTO>>> getAllStudents() {
        List<UserProfileDTO> students = userRepository.findByRole(UserRole.STUDENT).stream()
            .map(u -> UserProfileDTO.builder()
                .uuid(u.getUuid())
                .username(u.getUsername())
                .email(u.getEmail())
                .role(u.getRole())
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(students, "Students retrieved"));
    }
}
