package com.student.dashboard.server.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AssignmentSubmissionDTO {
    private UUID uuid;
    private UUID assignmentUuid;
    private String assignmentTitle;
    private UUID studentUuid;
    private String studentName;
    private String content;
    private LocalDateTime submittedAt;
    private Integer score;
    private String feedback;
}
