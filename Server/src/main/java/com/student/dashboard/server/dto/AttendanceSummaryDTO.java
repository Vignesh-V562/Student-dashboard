package com.student.dashboard.server.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AttendanceSummaryDTO {
    private UUID subjectUuid;
    private String subjectName;
    private int presentCount;
    private int totalCount;
    private int percentage;
}
