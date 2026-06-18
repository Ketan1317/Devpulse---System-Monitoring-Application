package com.Project.Devpulse.DTOs.Incident;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class IncidentResponse {

    private UUID id;
    private UUID monitorId;
    private String monitorName;

    private String status;
    private String reason;

    private Instant startedAt;
    private Instant resolvedAt;
}