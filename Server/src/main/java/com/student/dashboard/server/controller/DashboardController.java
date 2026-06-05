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
}
