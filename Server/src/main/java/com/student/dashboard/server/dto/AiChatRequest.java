package com.student.dashboard.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatRequest {
    private List<AiChatMessage> messages;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiChatMessage {
        private String role;
        private String content;
    }
}
