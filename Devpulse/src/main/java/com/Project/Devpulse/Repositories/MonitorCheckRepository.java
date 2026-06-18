package com.Project.Devpulse.Repositories;

import com.Project.Devpulse.Models.Monitoring.MonitorCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MonitorCheckRepository extends JpaRepository<MonitorCheck, UUID> {
    // Latest check for a monitor
    Optional<MonitorCheck> findFirstByMonitorIdOrderByCheckedAtDesc(UUID monitorId);

    // Last 100 checks (for charts)
    List<MonitorCheck> findTop100ByMonitorIdOrderByCheckedAtDesc(UUID monitorId);

    // Entire history
    List<MonitorCheck> findByMonitorIdOrderByCheckedAtDesc(UUID monitorId);

    // Recent failures
    List<MonitorCheck> findByMonitorIdAndHealthyFalseOrderByCheckedAtDesc(UUID monitorId);

    // Count successful checks
    long countByMonitorIdAndHealthyTrue(UUID monitorId);

    // Count all checks
    long countByMonitorId(UUID monitorId);
    long countByMonitorUserId(UUID userId);

    @Query("""
            SELECT AVG(mc.latencyMs)
            FROM MonitorCheck mc
            WHERE mc.monitor.id = :monitorId
            """)
    Double getAverageLatency(
            @Param("monitorId") UUID monitorId
    );

    long countByMonitorIdAndHealthyFalse(UUID monitorId);
    long countByMonitorUserIdAndHealthyTrue(UUID userId);
}
