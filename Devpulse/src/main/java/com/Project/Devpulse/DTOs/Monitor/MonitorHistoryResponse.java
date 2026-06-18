package com.Project.Devpulse.DTOs.Monitor;

import lombok.Builder;

import java.time.Instant;

@Builder
public record MonitorHistoryResponse(

        Instant checkedAt,

        Integer statusCode,

        Long latencyMs,

        Boolean healthy,

        String errorMessage

) {
}
