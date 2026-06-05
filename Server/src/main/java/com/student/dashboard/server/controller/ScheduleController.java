package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.dto.ScheduleEntryDTO;
import com.student.dashboard.server.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleEntryDTO>>> getSchedule(
            @RequestParam(required = false) String day) {
        if (day != null) {
            return ResponseEntity.ok(ApiResponse.success(scheduleService.getScheduleByDay(day),
                    "Schedule for " + day + " retrieved successfully"));
        }
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getAllSchedule(),
                "Full schedule retrieved successfully"));
    }
}
