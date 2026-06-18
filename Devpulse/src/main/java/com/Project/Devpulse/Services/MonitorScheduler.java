package com.Project.Devpulse.Services;

import com.Project.Devpulse.Models.Monitoring.Monitor;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Repositories.MonitorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
// This service runs every 30 seconds and checks all active monitors to see if they need to be executed based on their last checked time and interval.
public class MonitorScheduler {

    private final MonitorRepository monitorRepository;
    private final MonitorExecutorService monitorExecutorService;

    @Scheduled(fixedRate = 30000) // every 30 seconds
    public void runChecks() {

        log.info("Running monitor scheduler...");

        List<Monitor> monitors = monitorRepository.findByActiveTrue();

        Instant now = Instant.now();

        for (Monitor monitor : monitors) {

            try {

                if (shouldRun(monitor, now)) {

                    monitorExecutorService.runCheck(monitor.getId());

                    log.info("Executed monitor {}", monitor.getName());
                }

            } catch (Exception e) {

                log.error("Failed monitor {}", monitor.getId(), e);
            }
        }
    }

    // Determine if a monitor should be run based on its last checked time and the defined interval.
    private boolean shouldRun(Monitor monitor, Instant now) {

        if (monitor.getLastCheckedAt() == null) {
            return true;
        }

        long secondsSinceLastRun = ChronoUnit.SECONDS.between(monitor.getLastCheckedAt(), now);

        return secondsSinceLastRun >= monitor.getIntervalSeconds();
    }
}