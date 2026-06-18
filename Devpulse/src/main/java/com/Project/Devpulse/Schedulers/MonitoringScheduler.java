package com.Project.Devpulse.Schedulers;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class MonitoringScheduler {

    @Scheduled(fixedDelay = 60000)
    public void monitorServices() {
        // Implement monitoring logic
    }

}

