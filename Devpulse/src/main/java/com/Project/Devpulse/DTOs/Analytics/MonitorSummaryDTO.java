package com.Project.Devpulse.DTOs.Analytics;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Builder
@Getter
@Setter
public class MonitorSummaryDTO {

    private UUID id;

    private String name;

    private String url;

    private String status;

    private Double uptime;

    private Double avgLatency;

    private Instant lastCheckedAt;

    private Long incidentsCount;
}
