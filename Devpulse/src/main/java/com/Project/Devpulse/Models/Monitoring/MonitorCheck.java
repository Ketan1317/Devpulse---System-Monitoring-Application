package com.Project.Devpulse.Models.Monitoring;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "monitor_checks")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
// This entity represents the result of a single check performed on a monitor. It captures the status code, latency, health status, response size, error message (if any), and the timestamp of when the check was performed.
public class MonitorCheck {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monitor_id", nullable = false)
    private Monitor monitor;

    @Column(nullable = false)
    private Integer statusCode;

    @Column(nullable = false)
    private Long latencyMs;

    @Column(nullable = false)
    private Boolean healthy;

    private Long responseSizeBytes;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column(nullable = false)
    private Instant checkedAt;
}
