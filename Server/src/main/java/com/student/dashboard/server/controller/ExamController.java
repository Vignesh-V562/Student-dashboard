package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.dto.ExamDTO;
import com.student.dashboard.server.entity.Exam;
import com.student.dashboard.server.security.UserDetailsImpl;
import com.student.dashboard.server.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ExamDTO>>> getAllExams(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {

        Specification<Exam> spec = Specification.where(null);
        if (title != null) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
        }
        if (startDate != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("scheduledAt"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("scheduledAt"), endDate));
        }

        Page<ExamDTO> exams = examService.findAllForUser(userDetails.getUsername(), spec, pageable);
        return ResponseEntity.ok(ApiResponse.success(exams, "Exams retrieved successfully"));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<Page<ExamDTO>>> getUpcomingExams(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            Pageable pageable) {
        Page<ExamDTO> exams = examService.findUpcomingForUser(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success(exams, "Upcoming exams retrieved successfully"));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExamDTO>> createExam(@RequestBody ExamDTO examDTO) {
        return ResponseEntity.ok(ApiResponse.success(examService.createExam(examDTO), "Exam created successfully"));
    }

    @PutMapping("/{uuid}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExamDTO>> updateExam(@PathVariable UUID uuid, @RequestBody ExamDTO examDTO) {
        return ResponseEntity.ok(ApiResponse.success(examService.updateExam(uuid, examDTO), "Exam updated successfully"));
    }

    @DeleteMapping("/{uuid}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteExam(@PathVariable UUID uuid) {
        examService.deleteExam(uuid);
        return ResponseEntity.ok(ApiResponse.success(null, "Exam deleted successfully"));
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ApiResponse<ExamDTO>> getExamByUuid(@PathVariable UUID uuid) {
        return ResponseEntity.ok(ApiResponse.success(examService.findByUuid(uuid), "Exam retrieved successfully"));
    }
}
