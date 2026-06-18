package com.Project.Devpulse.Repositories;

import com.Project.Devpulse.Models.Monitoring.Monitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MonitorRepository extends JpaRepository<Monitor, UUID> {

    List<Monitor> findByUserId(UUID userId);

    Optional<Monitor> findByIdAndUserId(UUID monitorId, UUID userId);

    // Find all active monitors
    List<Monitor> findByActiveTrue();

    long countByUserId(UUID userId);

    long countByUserIdAndActiveTrue(UUID userId);
}
