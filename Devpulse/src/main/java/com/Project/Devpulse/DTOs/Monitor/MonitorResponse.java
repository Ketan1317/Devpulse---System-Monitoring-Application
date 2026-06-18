package com.Project.Devpulse.DTOs.Monitor;

import com.Project.Devpulse.Models.Monitoring.Types.MonitorType;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record MonitorResponse(

        UUID id,

        String name,

        String url,

        MonitorType type,

        Integer intervalSeconds,

        Boolean active,

        Instant sslExpiryDate,

        Long sslDaysRemaining,

        String sslIssuer

) {
}