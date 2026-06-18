package com.Project.Devpulse.Services;

import com.Project.Devpulse.DTOs.Monitor.CheckResult;
import com.Project.Devpulse.Models.Monitoring.Incident;
import com.Project.Devpulse.Models.Monitoring.Monitor;
import com.Project.Devpulse.Models.Monitoring.MonitorCheck;
import com.Project.Devpulse.Models.Monitoring.Types.IncidentStatus;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Repositories.IncidentRepository;
import com.Project.Devpulse.Repositories.MonitorCheckRepository;
import com.Project.Devpulse.Repositories.MonitorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.HttpsURLConnection;
import java.net.URL;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
// This service is responsible for executing checks on monitors, including making HTTP requests and updating SSL information.
public class MonitorExecutorService {
    private final MonitorRepository monitorRepository;
    private final MonitorCheckRepository monitorCheckRepository;
    private final RestTemplate restTemplate;
    private final IncidentRepository incidentRepository;
    private final EmailService emailService;

    public CheckResult execute(Monitor monitor) {

        long start = System.currentTimeMillis();

        try {
            // Make an HTTP GET request to the monitor's URL and measure latency and response size
            ResponseEntity<String> response = restTemplate.getForEntity(monitor.getUrl(), String.class);

            long latency = System.currentTimeMillis() - start;

            // Calculate response size in bytes (using the length of the response body as a simple approximation)
            long size = response.getBody() == null ? 0 : response.getBody().length();

            return CheckResult.builder()
                    .statusCode(response.getStatusCode().value())
                    .latencyMs(latency)
                    .responseSizeBytes(size)
                    .healthy(response.getStatusCode().is2xxSuccessful())
                    .build();

        } catch (Exception e) {

            long latency = System.currentTimeMillis() - start;

            return CheckResult.builder()
                    .statusCode(0)
                    .latencyMs(latency)
                    .healthy(false)
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    // This method updates the SSL information for a monitor by connecting to its URL and retrieving the SSL certificate details. It handles both successful retrieval and exceptions that may occur during the process.
    private void updateSslInfo(Monitor monitor) {

        try {

            URL url = new URL(monitor.getUrl());

            // Open an HTTPS connection to the URL and retrieve the server's SSL certificate
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();

            connection.connect();

            Certificate[] certificates = connection.getServerCertificates();

            X509Certificate cert = (X509Certificate) certificates[0];

            Instant expiryDate = cert.getNotAfter().toInstant();

            // Calculate the number of days remaining until the SSL certificate expires
            long daysRemaining = ChronoUnit.DAYS.between(Instant.now(), expiryDate);

            monitor.setSslExpiryDate(expiryDate);
            monitor.setSslDaysRemaining((long) daysRemaining);
            monitor.setSslIssuer(cert.getIssuerX500Principal().getName());

            monitorRepository.save(monitor);

            connection.disconnect();

        } catch (Exception e) {

            monitor.setSslExpiryDate(null);
            monitor.setSslDaysRemaining(null);
            monitor.setSslIssuer(null);

            monitorRepository.save(monitor);
        }
    }

    // This method runs a check on a monitor for a specific user. It retrieves the monitor by its ID and the user's ID, executes the check, and returns the result.
    @Transactional
    public MonitorCheck runCheck(UUID monitorId, User user) {

        Monitor monitor = monitorRepository.findByIdAndUserId(monitorId, user.getId())
                .orElseThrow(() -> new RuntimeException("Monitor not found"));

        return executeMonitor(monitor);
    }

    // This method is for Scheduler, It runs a check on a monitor by its ID. It retrieves the monitor, executes the check, and returns the result. This method is transactional to ensure that all database operations are completed successfully or rolled back in case of an error.
    @Transactional
    public MonitorCheck runCheck(UUID monitorId) {
        Monitor monitor = monitorRepository.findById(monitorId).orElseThrow(() -> new RuntimeException("Monitor not found"));
        return executeMonitor(monitor);
    }

    private MonitorCheck executeMonitor(Monitor monitor) {

        if (monitor.getUrl().startsWith("https://")) {
            updateSslInfo(monitor);
        }

        CheckResult result = execute(monitor);

        MonitorCheck check = MonitorCheck.builder()
                .monitor(monitor)
                .statusCode(result.statusCode())
                .latencyMs(result.latencyMs())
                .healthy(result.healthy())
                .responseSizeBytes(result.responseSizeBytes())
                .errorMessage(result.errorMessage())
                .checkedAt(Instant.now())
                .build();

        MonitorCheck savedCheck = monitorCheckRepository.save(check);

        handleIncident(monitor, savedCheck);

        monitor.setLastCheckedAt(Instant.now());

        monitorRepository.save(monitor);

        return savedCheck;
    }

    // This method handles incidents based on the results of a monitor check. If the check is unhealthy and there is no open incident for the monitor, it creates a new incident. If the check is healthy and there is an open incident, it resolves the incident by updating its status and resolved timestamp.
    private void handleIncident(Monitor monitor, MonitorCheck check) {

        if (!check.getHealthy()) {

            boolean openIncidentExists = incidentRepository.findByMonitorIdAndStatus(monitor.getId(), IncidentStatus.OPEN).isPresent();

            if (!openIncidentExists) {

                Incident incident = Incident.builder()
                        .monitor(monitor)
                        .status(IncidentStatus.OPEN)
                        .startedAt(Instant.now())
                        .reason(check.getErrorMessage() == null ? "Health check failed" : check.getErrorMessage())
                        .build();

                incidentRepository.save(incident);

                // SEND DOWN ALERT
                emailService.sendAlert(monitor.getUser().getEmail(),
                        "🚨 Monitor Down - " + monitor.getName(),
                        """
                        Monitor: %s

                        URL:
                        %s

                        Reason:
                        %s

                        Time:
                        %s
                        """
                                .formatted(
                                        monitor.getName(),
                                        monitor.getUrl(),
                                        incident.getReason(),
                                        Instant.now()
                                )
                );
            }

        } else {

            incidentRepository.findByMonitorIdAndStatus(monitor.getId(), IncidentStatus.OPEN).ifPresent(incident -> {

                        incident.setStatus(IncidentStatus.RESOLVED);

                        incident.setResolvedAt(Instant.now());

                        incidentRepository.save(incident);

                        // SEND RECOVERY ALERT
                        emailService.sendAlert(monitor.getUser().getEmail(),
                                "✅ Monitor Recovered - " + monitor.getName(),
                                """
                                Monitor: %s

                                URL:
                                %s

                                Service has recovered.

                                Downtime Started:
                                %s

                                Recovered At:
                                %s
                                """
                                        .formatted(
                                                monitor.getName(),
                                                monitor.getUrl(),
                                                incident.getStartedAt(),
                                                incident.getResolvedAt()
                                        )
                        );
                    });
        }
    }

}
