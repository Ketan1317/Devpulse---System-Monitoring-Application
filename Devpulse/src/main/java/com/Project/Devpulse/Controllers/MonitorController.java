package com.Project.Devpulse.Controllers;

import com.Project.Devpulse.DTOs.Monitor.*;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Services.MonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monitors")
@RequiredArgsConstructor
public class MonitorController {

    private final MonitorService monitorService;

    @PostMapping
    public MonitorResponse create(@RequestBody CreateMonitorRequest request, @AuthenticationPrincipal User user) {
        return monitorService.create(request, user);
    }

    @GetMapping
    public List<MonitorResponse> getAll(@AuthenticationPrincipal User user) {
        return monitorService.getAll(user);
    }

    @GetMapping("/{id}")
    public MonitorResponse getById(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        return monitorService.getById(id, user);
    }

    @PutMapping("/{id}")
    public MonitorResponse update(@PathVariable UUID id, @RequestBody UpdateMonitorRequest request, @AuthenticationPrincipal User user) {
        return monitorService.update(id, request, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        monitorService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{monitorId}/history")
    public ResponseEntity<List<MonitorHistoryResponse>> history(@PathVariable UUID monitorId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                monitorService.getHistory(monitorId, user)
        );
    }
}