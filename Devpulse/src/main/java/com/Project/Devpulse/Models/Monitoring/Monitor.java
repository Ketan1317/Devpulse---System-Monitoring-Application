package com.Project.Devpulse.Models.Monitoring;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.validator.constraints.URL;

import com.Project.Devpulse.Models.Monitoring.Types.MonitorType;
import com.Project.Devpulse.Models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "monitors")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Prevents Hibernate proxy issues
public class Monitor {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore  // Hide full user object in most responses
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
    @JsonIgnore  // ← Important: Prevent incidents from being serialized here
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