package com.Project.Devpulse.Controllers;

import com.Project.Devpulse.DTOs.User.UserResponse;
import com.Project.Devpulse.Models.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.isActive()
        );
    }
}