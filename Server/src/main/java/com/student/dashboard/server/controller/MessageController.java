package com.student.dashboard.server.controller;

import com.student.dashboard.server.dto.ApiResponse;
import com.student.dashboard.server.dto.MessageDTO;
import com.student.dashboard.server.security.UserDetailsImpl;
import com.student.dashboard.server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MessageDTO>>> getMessages(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                messageService.getMessagesForUser(userDetails.getUuid()),
                "Messages retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MessageDTO>> sendMessage(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.student.dashboard.server.dto.MessageRequest request) {
        
        MessageDTO dto = messageService.sendMessage(userDetails.getUuid(), request.getReceiverUuid(), request.getContent());
        return ResponseEntity.ok(ApiResponse.success(dto, "Message sent successfully"));
    }
}
