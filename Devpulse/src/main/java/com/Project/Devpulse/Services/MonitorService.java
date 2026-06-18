package com.Project.Devpulse.Services;

import com.Project.Devpulse.DTOs.Monitor.*;
import com.Project.Devpulse.Models.Monitoring.Monitor;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Repositories.MonitorCheckRepository;
import com.Project.Devpulse.Repositories.MonitorRepository;
import com.Project.Devpulse.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MonitorService {

    private final MonitorRepository monitorRepository;
    private final UserRepository userRepository;
    private final MonitorCheckRepository monitorCheckRepository;

    // Create a new monitor for the authenticated user
    public MonitorResponse create(CreateMonitorRequest request, User user) {

        Monitor monitor = Monitor.builder()
                .user(user)
                .name(request.name())
                .url(request.url())
                .type(request.type())
                .intervalSeconds(request.intervalSeconds())
                .active(true)
                .build();
        System.out.println(monitor.toString());

        monitor = monitorRepository.save(monitor);

        return mapToResponse(monitor);
    }

    public List<MonitorResponse> getAll(User user) {
        return monitorRepository.findByUserId(user.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public MonitorResponse getById(UUID monitorId, User user) {


        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, user.getId()).orElseThrow();

        return mapToResponse(monitor);
    }

    public MonitorResponse update(UUID monitorId, UpdateMonitorRequest request, User user) {

        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, user.getId()).orElseThrow();

        monitor.setName(request.name());
        monitor.setUrl(request.url());
        monitor.setType(request.type());
        monitor.setIntervalSeconds(request.intervalSeconds());
        monitor.setActive(request.active());

        return mapToResponse(monitorRepository.save(monitor));
    }

    public void delete(UUID monitorId, User user) {

        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, user.getId()).orElseThrow();

        monitorRepository.delete(monitor);
    }

    public UptimeResponse getUptime(UUID monitorId) {

        long total = monitorCheckRepository.countByMonitorId(monitorId);

        long success = monitorCheckRepository.countByMonitorIdAndHealthyTrue(monitorId);

        long failed = monitorCheckRepository.countByMonitorIdAndHealthyFalse(monitorId);

        double uptime = total == 0
                        ? 100.0
                        : ((double) success / total) * 100;

        return UptimeResponse.builder()
                .uptimePercentage(uptime)
                .totalChecks(total)
                .successfulChecks(success)
                .failedChecks(failed)
                .build();
    }

    public List<MonitorHistoryResponse> getHistory(UUID monitorId, User user) {

        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, user.getId()).orElseThrow();

        return monitorCheckRepository.findTop100ByMonitorIdOrderByCheckedAtDesc(monitor.getId())
                .stream()
                .map(check -> MonitorHistoryResponse.builder()
                        .checkedAt(check.getCheckedAt())
                        .statusCode(check.getStatusCode())
                        .latencyMs(check.getLatencyMs())
                        .healthy(check.getHealthy())
                        .errorMessage(check.getErrorMessage())
                        .build())
                .toList();
    }

    public UptimeResponse getUptime(UUID monitorId, User user) {

        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, user.getId())
                .orElseThrow(() -> new RuntimeException("Monitor not found"));

        long total = monitorCheckRepository.countByMonitorId(monitor.getId());

        long success = monitorCheckRepository.countByMonitorIdAndHealthyTrue(monitor.getId());

        long failed = monitorCheckRepository.countByMonitorIdAndHealthyFalse(monitor.getId());

        double uptime = total == 0
                        ? 100.0
                        : ((double) success / total) * 100.0;

        return UptimeResponse.builder()
                .uptimePercentage(uptime)
                .totalChecks(total)
                .successfulChecks(success)
                .failedChecks(failed)
                .build();
    }

    private MonitorResponse mapToResponse(Monitor monitor) {

        return MonitorResponse.builder()
                .id(monitor.getId())
                .name(monitor.getName())
                .url(monitor.getUrl())
                .type(monitor.getType())
                .intervalSeconds(monitor.getIntervalSeconds())
                .active(monitor.getActive())
                .sslExpiryDate(monitor.getSslExpiryDate())
                .sslDaysRemaining(monitor.getSslDaysRemaining())
                .sslIssuer(monitor.getSslIssuer())
                .build();
    }


}
