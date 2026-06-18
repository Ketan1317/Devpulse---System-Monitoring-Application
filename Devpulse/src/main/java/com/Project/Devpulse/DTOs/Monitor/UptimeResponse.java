package com.Project.Devpulse.DTOs.Monitor;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UptimeResponse {

    private double uptimePercentage;
    private long totalChecks;
    private long successfulChecks;
    private long failedChecks;
}
