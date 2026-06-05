package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.dto.AssignmentDTO;
import com.student.dashboard.server.security.UserDetailsImpl;
import com.student.dashboard.server.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssignmentDTO>>> getAssignments(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAllAssignments(userDetails.getUuid()),
                "Assignments retrieved successfully"));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<AssignmentDTO>>> getPendingAssignments(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getPendingAssignments(userDetails.getUuid()),
                "Pending assignments retrieved successfully"));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDTO>> createAssignment(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @org.springframework.web.bind.annotation.RequestBody AssignmentDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.createAssignment(dto, userDetails.getUuid()),
                "Assignment created successfully"));
    }

    @PutMapping("/{uuid}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDTO>> updateAssignment(
            @org.springframework.web.bind.annotation.PathVariable java.util.UUID uuid,
            @org.springframework.web.bind.annotation.RequestBody AssignmentDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.updateAssignment(uuid, dto),
                "Assignment updated successfully"));
    }

    @DeleteMapping("/{uuid}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @org.springframework.web.bind.annotation.PathVariable java.util.UUID uuid) {
        assignmentService.deleteAssignment(uuid);
        return ResponseEntity.ok(ApiResponse.success(null, "Assignment deleted successfully"));
    }
}
