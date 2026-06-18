package com.Project.Devpulse.Models;

import com.Project.Devpulse.Models.Monitoring.Monitor;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_insights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monitor_id")
    private Monitor monitor;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String possibleCause;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    private Double uptimePercentage;

    private Double averageLatency;

    private Integer incidentsCount;

    private Instant generatedAt;
}
