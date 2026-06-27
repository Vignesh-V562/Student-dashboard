package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.dto.AssignmentDTO;
import com.student.dashboard.server.dto.AssignmentSubmissionDTO;
import com.student.dashboard.server.security.UserDetailsImpl;
import com.student.dashboard.server.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssignmentDTO>>> getAssignments(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER"))) {
            return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsForTeacher(userDetails.getUuid()), "Assignments retrieved successfully"));
        } else {
            return ResponseEntity.ok(ApiResponse.success(assignmentService.getAllAssignments(), "Assignments retrieved successfully"));
        }
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDTO>> createAssignment(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody AssignmentDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.createAssignment(dto, userDetails.getUuid()),
                "Assignment created successfully"));
    }

    @PutMapping("/{uuid}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDTO>> updateAssignment(
            @PathVariable UUID uuid,
            @RequestBody AssignmentDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.updateAssignment(uuid, dto),
                "Assignment updated successfully"));
    }

    @DeleteMapping("/{uuid}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @PathVariable UUID uuid) {
        assignmentService.deleteAssignment(uuid);
        return ResponseEntity.ok(ApiResponse.success(null, "Assignment deleted successfully"));
    }

    @PostMapping("/{uuid}/submit")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentSubmissionDTO>> submitAssignment(
            @PathVariable UUID uuid,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                assignmentService.submitAssignment(uuid, userDetails.getUuid(), body.get("content")),
                "Assignment submitted successfully"));
    }

    @GetMapping("/{uuid}/submissions")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AssignmentSubmissionDTO>>> getSubmissions(
            @PathVariable UUID uuid) {
        return ResponseEntity.ok(ApiResponse.success(
                assignmentService.getSubmissionsForAssignment(uuid),
                "Submissions retrieved successfully"));
    }

    @PostMapping("/submissions/{uuid}/grade")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentSubmissionDTO>> gradeSubmission(
            @PathVariable UUID uuid,
            @RequestBody Map<String, Object> body) {
        Integer score = null;
        if (body.get("score") != null) {
            score = Integer.parseInt(body.get("score").toString());
        }
        String feedback = body.get("feedback") != null ? body.get("feedback").toString() : null;
        
        return ResponseEntity.ok(ApiResponse.success(
                assignmentService.gradeSubmission(uuid, score, feedback),
                "Submission graded successfully"));
    }
}
