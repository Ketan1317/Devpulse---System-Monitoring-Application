package com.Project.Devpulse.Controllers;

import com.Project.Devpulse.DTOs.User.LoginRequest;
import com.Project.Devpulse.DTOs.User.LoginResponse;
import com.Project.Devpulse.DTOs.User.RefreshRequest;
import com.Project.Devpulse.DTOs.User.RegisterRequest;
import com.Project.Devpulse.Services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        System.out.println("Login attempt for email: " + request.email());
        System.out.println("Password: " + request.password());
        return ResponseEntity.ok(authService.login(request.email(), request.password(),response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(HttpServletRequest request, HttpServletResponse response
    ) {

        return ResponseEntity.ok(authService.refresh(request, response));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {

        authService.logout(request, response);
        return ResponseEntity.ok("Logged out successfully");
    }
}