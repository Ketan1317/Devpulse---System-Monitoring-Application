package com.Project.Devpulse.DTOs.Analytics;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AIInsightResponse {

    private String summary;

    private String possibleCause;

    private String recommendation;
}

