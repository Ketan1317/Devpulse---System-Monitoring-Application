package com.Project.Devpulse.Controllers;

import com.Project.Devpulse.DTOs.User.UserProfileResponse;
import com.Project.Devpulse.Models.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Authenticated successfully";
    }

    @GetMapping("/me")
    public UserProfileResponse me(@AuthenticationPrincipal User user) {

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @GetMapping("/whoami")
    public Object whoAmI(Authentication authentication) {
        return authentication.getPrincipal();
    }
}