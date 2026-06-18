package com.Project.Devpulse.DTOs.User;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        String avatarUrl,
        boolean active
) {
}