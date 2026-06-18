package com.Project.Devpulse.Repositories;

import com.Project.Devpulse.Models.Monitoring.Incident;
import com.Project.Devpulse.Models.Monitoring.Types.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    Optional<Incident> findByMonitorIdAndStatus(UUID monitorId, IncidentStatus status);
    long countByStatus(IncidentStatus status);
    long countByMonitorUserIdAndStatus(UUID userId, IncidentStatus status);
    int countByMonitorId(UUID monitorId);
    List<Incident> findByMonitorUserId(UUID userId);
    boolean existsByMonitorIdAndStatus(UUID monitorId, IncidentStatus status);


}

