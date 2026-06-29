package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.AiChatRequest;
import com.student.dashboard.server.dto.AiChatResponse;
import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.service.GroqAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final GroqAiService groqAiService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(@RequestBody AiChatRequest request) {
        String responseText = groqAiService.generateChatResponse(request.getMessages());
        return ResponseEntity.ok(ApiResponse.success(
                new AiChatResponse(responseText),
                "Chat response generated successfully"
        ));
    }
}
