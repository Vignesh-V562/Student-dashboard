package com.student.dashboard.server.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardSummaryDTO {
    private long totalExams;
    private long pendingExams;
    private long completedExams;
    private long enrolledCourses;
}
