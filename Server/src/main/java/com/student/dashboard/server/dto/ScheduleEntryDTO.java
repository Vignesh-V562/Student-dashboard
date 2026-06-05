package com.student.dashboard.server.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class ScheduleEntryDTO {
    private UUID uuid;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String subjectName;
    private UUID subjectUuid;
    private String room;
}
