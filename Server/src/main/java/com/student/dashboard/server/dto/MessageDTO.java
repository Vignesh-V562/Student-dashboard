package com.student.dashboard.server.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class MessageDTO {
    private UUID uuid;
    private String senderName;
    private String receiverName;
    private String content;
    private boolean read;
    private LocalDateTime createdAt;
}
