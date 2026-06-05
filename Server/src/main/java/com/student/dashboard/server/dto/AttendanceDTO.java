package com.student.dashboard.server.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class AttendanceDTO {
    private UUID uuid;
    private LocalDate date;
    private String subjectName;
    private UUID subjectUuid;
    private boolean present;
}
