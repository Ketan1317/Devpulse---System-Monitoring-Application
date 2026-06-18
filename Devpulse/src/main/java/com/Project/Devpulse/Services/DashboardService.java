package com.Project.Devpulse.Services;

import com.Project.Devpulse.DTOs.Analytics.DashboardResponse;
import com.Project.Devpulse.DTOs.Analytics.MonitorSummaryDTO;
import com.Project.Devpulse.Models.Monitoring.Monitor;
import com.Project.Devpulse.Models.Monitoring.Types.IncidentStatus;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Repositories.IncidentRepository;
import com.Project.Devpulse.Repositories.MonitorCheckRepository;
import com.Project.Devpulse.Repositories.MonitorRepository;
import com.Project.Devpulse.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final MonitorRepository monitorRepository;
    private final IncidentRepository incidentRepository;
    private final MonitorCheckRepository monitorCheckRepository;

    public DashboardResponse getDashboard(User user) {

        long totalMonitors = monitorRepository.countByUserId(user.getId());

        long activeIncidents = incidentRepository.countByMonitorUserIdAndStatus(user.getId(), IncidentStatus.OPEN);

        long totalChecks = monitorCheckRepository.countByMonitorUserId(user.getId());

        long successfulChecks = monitorCheckRepository.countByMonitorUserIdAndHealthyTrue(user.getId());

        double uptime = totalChecks == 0 ? 100 : ((double) successfulChecks / totalChecks) * 100;

        Double averageLatency = monitorCheckRepository.getAverageLatency(user.getId());

        List<MonitorSummaryDTO> monitors = monitorRepository.findByUserId(user.getId()).stream().map(this::buildMonitorSummary).toList();

        return DashboardResponse.builder()
                .totalMonitors(totalMonitors)
                .healthyMonitors(totalMonitors - activeIncidents)
                .downMonitors(activeIncidents)
                .activeIncidents(activeIncidents)
                .overallUptime(uptime)
                .averageLatency(averageLatency == null ? 0 : averageLatency)
                .monitors(monitors)
                .build();
    }

    private MonitorSummaryDTO buildMonitorSummary(Monitor monitor) {

        long checks = monitorCheckRepository.countByMonitorId(monitor.getId());

        long success = monitorCheckRepository.countByMonitorIdAndHealthyTrue(monitor.getId());

        double uptime = checks == 0 ? 100 : ((double) success / checks) * 100;

        Double avgLatency = monitorCheckRepository.getAverageLatency(monitor.getId());

        long incidents = incidentRepository.countByMonitorId(monitor.getId());

        String status = incidentRepository.existsByMonitorIdAndStatus(monitor.getId(), IncidentStatus.OPEN) ? "DOWN" : "UP";

        return MonitorSummaryDTO.builder()
                .id(monitor.getId())
                .name(monitor.getName())
                .url(monitor.getUrl())
                .status(status)
                .uptime(uptime)
                .avgLatency(avgLatency)
                .lastCheckedAt(monitor.getLastCheckedAt())
                .incidentsCount(incidents)
                .build();
    }
}
