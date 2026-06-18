package com.Project.Devpulse.Controllers;

import com.Project.Devpulse.DTOs.Monitor.UptimeResponse;
import com.Project.Devpulse.Models.Monitoring.MonitorCheck;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Services.MonitorExecutorService;
import com.Project.Devpulse.Services.MonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/monitor-checks")
@RequiredArgsConstructor
public class MonitorCheckController {

    private final MonitorExecutorService monitorExecutorService;
    private final MonitorService monitorService;

    @PostMapping("/{monitorId}")
    public MonitorCheck runCheck(@PathVariable UUID monitorId, @AuthenticationPrincipal User user) {
        return monitorExecutorService.runCheck(monitorId, user);
    }

    @GetMapping("/{id}/uptime")
    public UptimeResponse uptime(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        return monitorService.getUptime(id, user);
    }
}