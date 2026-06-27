package com.student.dashboard.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarkAttendanceRequest {
    private UUID studentUuid;
    private UUID subjectUuid;
    private LocalDate date;
    private boolean present;
}
