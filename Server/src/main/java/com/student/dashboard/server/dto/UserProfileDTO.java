package com.student.dashboard.server.dto;

import com.student.dashboard.server.entity.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserProfileDTO {
    private UUID uuid;
    private String username;
    private String email;
    private UserRole role;
}
