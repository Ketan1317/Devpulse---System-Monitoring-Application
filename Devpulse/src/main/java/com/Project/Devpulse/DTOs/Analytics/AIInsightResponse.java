package com.Project.Devpulse.DTOs.Analytics;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AIInsightResponse {

    private String summary;

    private List<String> possibleCause;

    private List<String> recommendation;
}

