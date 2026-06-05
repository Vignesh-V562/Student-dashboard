package com.student.dashboard.server.service;

import com.student.dashboard.server.dto.MessageDTO;
import com.student.dashboard.server.entity.Message;
import com.student.dashboard.server.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    @Transactional(readOnly = true)
    public List<MessageDTO> getMessagesForUser(UUID userUuid) {
        return messageRepository.findByReceiverUuidOrderByCreatedAtDesc(userUuid).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> getConversation(UUID user1Uuid, UUID user2Uuid) {
        return messageRepository.findBySenderUuidOrReceiverUuidOrderByCreatedAtDesc(user1Uuid, user2Uuid).stream()
                .map(this::toDto)
                .toList();
    }

    private final com.student.dashboard.server.repository.UserRepository userRepository;

    @Transactional
    public MessageDTO sendMessage(UUID senderUuid, UUID receiverUuid, String content) {
        com.student.dashboard.server.entity.User sender = userRepository.findByUuid(senderUuid)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        com.student.dashboard.server.entity.User receiver = userRepository.findByUuid(receiverUuid)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setRead(false);

        Message saved = messageRepository.save(message);
        return toDto(saved);
    }

    private MessageDTO toDto(Message message) {
        return MessageDTO.builder()
                .uuid(message.getUuid())
                .senderName(message.getSender().getUsername())
                .receiverName(message.getReceiver().getUsername())
                .content(message.getContent())
                .read(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
