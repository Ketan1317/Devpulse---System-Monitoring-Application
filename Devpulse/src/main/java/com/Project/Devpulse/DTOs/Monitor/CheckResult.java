package com.Project.Devpulse.DTOs.Monitor;

import lombok.Builder;

@Builder
public record CheckResult(

        Integer statusCode,

        Long latencyMs,

        Boolean healthy,

        Long responseSizeBytes,

        String errorMessage

) {
}
