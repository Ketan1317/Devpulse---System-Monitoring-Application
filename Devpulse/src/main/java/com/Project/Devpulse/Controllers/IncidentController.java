package com.Project.Devpulse.Controllers;

import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Services.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping
    public ResponseEntity<?> getIncidents(Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        System.out.println("User ID: " + user.getId());
        return ResponseEntity.ok(incidentService.getIncidents(user.getId())
        );
    }
}
