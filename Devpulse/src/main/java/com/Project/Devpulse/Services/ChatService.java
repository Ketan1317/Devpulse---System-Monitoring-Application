package com.Project.Devpulse.Services;

import com.Project.Devpulse.DTOs.Analytics.AIInsightResponse;
import com.Project.Devpulse.Models.Monitoring.Monitor;
import org.springframework.ai.chat.model.ChatModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatModel chatModel;

    public AIInsightResponse generateMonitorInsight(Monitor monitor, double uptime, double avgLatency, int incidents, String history) {

        String prompt = """
            You are a Senior Site Reliability Engineer.

            Analyze the following monitor.

            Monitor Name:
            %s

            URL:
            %s

            Uptime:
            %.2f%%

            Average Latency:
            %.2f ms

            Incident Count:
            %d

            Last 100 Checks:

            %s

            Based on the monitoring history:

            1. Summarize service health.
            2. Identify likely causes of failures.
            3. Provide actionable recommendations.

            Return ONLY valid JSON:

            {
              "summary":"",
              "possibleCause":"",
              "recommendation":""
            }
            """
                .formatted(
                        monitor.getName(),
                        monitor.getUrl(),
                        uptime,
                        avgLatency,
                        incidents,
                        history
                );

        String response = chatModel.call(prompt);
        String cleanedResponse = response
                .replace("```json", "")
                .replace("```", "")
                .trim();
        System.out.println("Raw AI Response: " + response); // Debugging line to check the raw AI response
        System.out.println("AI Response: " + cleanedResponse); // Debugging line to check the AI response

        ObjectMapper mapper = new ObjectMapper();

        try {
            return mapper.readValue(cleanedResponse, AIInsightResponse.class);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }

}
