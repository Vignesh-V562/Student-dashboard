package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.dto.DashboardSummaryDTO;
import com.student.dashboard.server.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getSummary(), "Dashboard summary retrieved successfully"));
    }

    @GetMapping("/teacher-summary")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getTeacherSummary() {
        java.util.Map<String, Object> summary = dashboardService.getTeacherSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "Teacher summary retrieved"));
    }

    @GetMapping("/attendance-trends")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<java.util.List<java.util.Map<String, Object>>>> getAttendanceTrends() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAttendanceTrends(), "Attendance trends retrieved"));
    }

    @GetMapping("/grade-distribution")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<java.util.List<java.util.Map<String, Object>>>> getGradeDistribution() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getGradeDistribution(), "Grade distribution retrieved"));
    }
}
