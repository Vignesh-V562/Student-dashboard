package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.dto.AttendanceCalendarDTO;
import com.student.dashboard.server.dto.AttendanceDTO;
import com.student.dashboard.server.security.UserDetailsImpl;
import com.student.dashboard.server.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import com.student.dashboard.server.dto.MarkAttendanceRequest;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAttendance(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        YearMonth month = YearMonth.now();
        LocalDate start = startDate != null ? startDate : month.atDay(1);
        LocalDate end = endDate != null ? endDate : month.atEndOfMonth();
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.getAttendance(userDetails.getUuid(), start, end),
                "Attendance retrieved successfully"));
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<AttendanceCalendarDTO>> getAttendanceOverview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        YearMonth ym = (year != null && month != null) ? YearMonth.of(year, month) : YearMonth.now();
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.getAttendanceOverview(userDetails.getUuid(), ym),
                "Attendance overview retrieved successfully"));
    }
    @PostMapping("/mark")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> markAttendance(@RequestBody MarkAttendanceRequest request) {
        attendanceService.markAttendance(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Attendance marked successfully"));
    }

    @GetMapping("/students")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAllStudentsAttendance() {
        return ResponseEntity.ok(ApiResponse.success(
            attendanceService.getAllStudentsAttendance(), "Students attendance retrieved"));
    }
}
