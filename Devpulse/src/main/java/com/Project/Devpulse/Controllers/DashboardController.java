package com.Project.Devpulse.Controllers;

import com.Project.Devpulse.DTOs.Analytics.DashboardResponse;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse dashboard(@AuthenticationPrincipal User user) {
        return dashboardService.getDashboard(user);
    }
}
