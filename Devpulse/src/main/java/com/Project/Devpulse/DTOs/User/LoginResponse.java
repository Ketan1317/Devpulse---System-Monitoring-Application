package com.Project.Devpulse.DTOs.User;

public record LoginResponse(
        String accessToken,
        Long expiresIn,
        String tokenType
) {}