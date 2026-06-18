package com.Project.Devpulse.Models.Monitoring;

import com.Project.Devpulse.Models.Monitoring.Types.MonitorType;
import com.Project.Devpulse.Models.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.URL;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "monitors")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
// This entity represents a monitoring configuration created by a user. It includes details such as the name of the monitor, the URL to be monitored, the type of monitoring (HTTP, Ping, etc.), the interval at which checks should be performed, and SSL certificate information if applicable. It also tracks when the monitor was created and last updated.
public class Monitor {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 500)
    @NotBlank
    @URL
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MonitorType type;

    @Column(nullable = false)
    private Integer intervalSeconds;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    // SSL info
    private Instant sslExpiryDate;

    private Long sslDaysRemaining;

    @Column(length = 255)
    private String sslIssuer;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @OneToMany(
            mappedBy = "monitor",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private java.util.List<Incident> incidents = new java.util.ArrayList<>();

    @Column(name = "last_checked_at")
    private Instant lastCheckedAt;


    @PrePersist
    public void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = Instant.now();
    }
}
