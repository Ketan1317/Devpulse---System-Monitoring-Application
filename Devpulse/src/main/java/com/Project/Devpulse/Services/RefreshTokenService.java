package com.Project.Devpulse.Services;

import com.Project.Devpulse.Models.RefreshToken;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Repositories.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repository;

    @Value("${spring.security.jwt.refresh-ttl-seconds}")
    private long refreshTtlSeconds;

    public RefreshToken create(User user){

        RefreshToken token = RefreshToken.builder()
                .jti(UUID.randomUUID().toString())
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(refreshTtlSeconds))
                .revoked(false)
                .build();

        return repository.save(token);
    }
}