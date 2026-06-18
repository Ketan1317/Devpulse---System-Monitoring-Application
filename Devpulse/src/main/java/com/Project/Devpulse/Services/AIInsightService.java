package com.Project.Devpulse.Services;

import com.Project.Devpulse.DTOs.Analytics.AIInsightResponse;
import com.Project.Devpulse.Models.AIInsight;
import com.Project.Devpulse.Models.Monitoring.Monitor;
import com.Project.Devpulse.Models.Monitoring.MonitorCheck;
import com.Project.Devpulse.Repositories.AIInsightRepository;
import com.Project.Devpulse.Repositories.IncidentRepository;
import com.Project.Devpulse.Repositories.MonitorCheckRepository;
import com.Project.Devpulse.Repositories.MonitorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AIInsightService {

    private final ChatService chatService;
    private final AIInsightRepository aiInsightRepository;
    public final MonitorCheckRepository monitorCheckRepository;
    public final MonitorRepository monitorRepository;
    private final MonitorService monitorService;
    private final IncidentRepository incidentRepository;



    @Transactional
    public AIInsight generateAndSave(UUID monitorId) {

        Monitor monitor = monitorRepository.findById(monitorId).orElseThrow(() -> new RuntimeException("Monitor not found"));

        double uptime = monitorService.getUptime(monitorId).getUptimePercentage();

        Double latency = monitorCheckRepository.getAverageLatency(monitorId);

        double avgLatency = latency == null ? 0.0 : latency;

        int incidents = incidentRepository.countByMonitorId(monitorId);

        List<MonitorCheck> checks = monitorCheckRepository.findTop100ByMonitorIdOrderByCheckedAtDesc(monitorId);

        String history = buildHistory(checks);
        System.out.println("History: " + history); // Debugging line to check the history content

        AIInsightResponse response = chatService.generateMonitorInsight(monitor, uptime, avgLatency, incidents,history);
        System.out.println("AI Insight Response: " + response); // Debugging line to check the AI response
        AIInsight insight = AIInsight.builder()
                        .monitor(monitor)
                        .summary(response.getSummary())
                        .possibleCause(response.getPossibleCause())
                        .recommendation(response.getRecommendation())
                        .uptimePercentage(uptime)
                        .averageLatency(avgLatency)
                        .incidentsCount(incidents)
                        .generatedAt(Instant.now())
                        .build();

        return aiInsightRepository.save(insight);
    }

    private String buildHistory(List<MonitorCheck> checks) {

        StringBuilder history = new StringBuilder();

        for (MonitorCheck check : checks) {

            history.append(String.format(
                            """
                            Time: %s
                            Healthy: %s
                            Status: %d
                            Latency: %d ms
                            Error: %s
    
                            """,
                            check.getCheckedAt(),
                            check.getHealthy(),
                            check.getStatusCode(),
                            check.getLatencyMs(),
                            check.getErrorMessage()
                    )
            );
        }

        return history.toString();
    }
}



