package com.student.dashboard.server.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AssignmentDTO {
    private UUID uuid;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private String subjectName;
    private UUID subjectUuid;
    private boolean completed;
    private Integer score;
}
