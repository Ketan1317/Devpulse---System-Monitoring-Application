package com.Project.Devpulse.Repositories;

import com.Project.Devpulse.Models.AIInsight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AIInsightRepository extends JpaRepository<AIInsight, UUID> {
    Optional<AIInsight> findTopByMonitorIdOrderByGeneratedAtDesc(UUID monitorId);
}

