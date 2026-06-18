package com.Project.Devpulse.DTOs.User;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record UserProfileResponse(

        UUID id,
        String fullName,
        String email,
        String avatarUrl,
        Boolean active,
        Instant createdAt

) {}
