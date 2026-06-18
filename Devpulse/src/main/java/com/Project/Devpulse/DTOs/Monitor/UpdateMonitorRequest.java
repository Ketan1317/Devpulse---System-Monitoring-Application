package com.Project.Devpulse.DTOs.Monitor;

import com.Project.Devpulse.Models.Monitoring.Types.MonitorType;
import lombok.Builder;

@Builder
public record UpdateMonitorRequest(

        String name,

        String url,

        MonitorType type,

        Integer intervalSeconds,

        Boolean active

) {
}

