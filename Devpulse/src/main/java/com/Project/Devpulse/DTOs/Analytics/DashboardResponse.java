package com.Project.Devpulse.DTOs.Analytics;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
public class DashboardResponse {

    private long totalMonitors;

    private long healthyMonitors;

    private long downMonitors;

    private long activeIncidents;

    private double overallUptime;

    private double averageLatency;

    private List<MonitorSummaryDTO> monitors;
}
