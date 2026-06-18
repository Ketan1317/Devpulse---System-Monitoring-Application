package com.Project.Devpulse.DTOs.Monitor;

import com.Project.Devpulse.Models.Monitoring.Types.MonitorType;
import lombok.Builder;

@Builder
public record CreateMonitorRequest (
     String name,
     String url,
     MonitorType type,
     Integer intervalSeconds
     ){}

