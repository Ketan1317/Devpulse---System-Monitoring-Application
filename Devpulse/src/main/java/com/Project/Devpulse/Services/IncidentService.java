package com.Project.Devpulse.Services;

import com.Project.Devpulse.DTOs.Incident.IncidentResponse;
import com.Project.Devpulse.Repositories.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public List<IncidentResponse> getIncidents(UUID userId) {

        return incidentRepository.findByMonitorUserId(userId).stream()
                .map(incident -> IncidentResponse.builder()
                        .id(incident.getId())
                        .monitorId(incident.getMonitor().getId())
                        .monitorName(incident.getMonitor().getName())
                        .status(incident.getStatus().name())
                        .reason(incident.getReason())
                        .startedAt(incident.getStartedAt())
                        .resolvedAt(incident.getResolvedAt())
                        .build()).toList();
    }
}