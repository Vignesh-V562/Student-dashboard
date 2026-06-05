package com.student.dashboard.server.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
public class AttendanceCalendarDTO {
    private Map<LocalDate, String> dayStatus;
    private java.util.List<AttendanceSummaryDTO> subjectBreakdown;
}
