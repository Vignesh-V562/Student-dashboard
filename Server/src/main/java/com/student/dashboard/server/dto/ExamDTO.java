package com.student.dashboard.server.dto;

import com.student.dashboard.server.entity.enums.ExamStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ExamDTO {
    private UUID uuid;
    private String title;
    private String description;
    private LocalDateTime scheduledAt;
    private Integer durationMinutes;
    private Integer maxMarks;
    private Integer passingMarks;
    private String courseName;
    private String subjectName;
    private ExamStatus status;
    private Integer participants;
}
