package com.Project.Devpulse.Services;

import com.Project.Devpulse.DTOs.User.LoginResponse;
import com.Project.Devpulse.DTOs.User.RegisterRequest;
import com.Project.Devpulse.Models.RefreshToken;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Repositories.RefreshTokenRepository;
import com.Project.Devpulse.Repositories.UserRepository;
import com.Project.Devpulse.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CookieService cookieService;

    @Value("${spring.security.jwt.refresh-token-cookie-name}")
    private String refreshCookieName;

    public void register(RegisterRequest req) {

        if (userRepository.existsByEmail(req.email())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .fullName(req.fullName())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .active(true)
                .build();

        userRepository.save(user);
    }

    public LoginResponse login(String email, String password, HttpServletResponse response) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        System.out.println(user);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String accessToken = jwtService.generateJwtToken(user);
        System.out.println("Generated access token: " + accessToken);

        RefreshToken refreshToken = refreshTokenService.create(user);
        System.out.println("Generated refresh token: " + refreshToken);

        cookieService.attachRefreshTokenToCookie(
                refreshToken.getJti(),
                response,
                (int) jwtService.getRefreshExpirationTime()
        );
        System.out.println("Attached refresh token to cookie: " + refreshToken.getJti());
        return new LoginResponse(
                accessToken,
                jwtService.getExpirationTime(),
                "Bearer"
        );
    }

    public LoginResponse refresh(HttpServletRequest request, HttpServletResponse response) {

        String refreshTokenValue = extractRefreshToken(request);

        RefreshToken refreshToken = refreshTokenRepository.findByJti(refreshTokenValue).orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (refreshToken.isRevoked()) {
            throw new RuntimeException("Refresh token revoked");
        }

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        User user = refreshToken.getUser();

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        RefreshToken newRefreshToken = refreshTokenService.create(user);

        cookieService.attachRefreshTokenToCookie(
                newRefreshToken.getJti(),
                response,
                (int) jwtService.getRefreshExpirationTime()
        );

        String accessToken = jwtService.generateJwtToken(user);

        return new LoginResponse(accessToken, jwtService.getExpirationTime(), "Bearer");
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {

        try {
            String refreshTokenValue = extractRefreshToken(request);

            refreshTokenRepository.findByJti(refreshTokenValue).ifPresent(token -> {token.setRevoked(true);
                refreshTokenRepository.save(token);});

        } catch (Exception ignored) {

        }

        cookieService.clearRefreshCookie(response);
    }

    private String extractRefreshToken(
            HttpServletRequest request
    ) {

        if (request.getCookies() == null) {
            throw new RuntimeException("Refresh token missing");
        }

        for (Cookie cookie : request.getCookies()) {

            if (cookie.getName().equals(refreshCookieName)) {
                return cookie.getValue();
            }
        }

        throw new RuntimeException("Refresh token missing");
    }
}