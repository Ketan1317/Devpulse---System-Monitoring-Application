package com.Project.Devpulse.Controllers;

import com.Project.Devpulse.Models.AIInsight;
import com.Project.Devpulse.Services.AIInsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AIInsightService service;

    @PostMapping("/monitors/{id}")
    public AIInsight generate(@PathVariable UUID id) {

        return service.generateAndSave(id);
    }
}

