package com.Project.Devpulse.Services;

import com.Project.Devpulse.DTOs.Analytics.AIInsightResponse;
import com.Project.Devpulse.Models.Monitoring.Monitor;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatModel chatModel;
    private final ObjectMapper mapper = new ObjectMapper();

    public AIInsightResponse generateMonitorInsight(
            Monitor monitor,
            double uptime,
            double avgLatency,
            int incidents,
            String history) {

        String prompt = """
                You are a Senior Site Reliability Engineer.

                Analyze the following monitor:

                Monitor Name: %s
                URL: %s
                Uptime: %.2f%%
                Average Latency: %.2f ms
                Total Incidents: %d

                Last 100 Checks:
                %s

                Return ONLY valid JSON.

                {
                  "summary": "string",
                  "possibleCause": [
                    "cause 1",
                    "cause 2"
                  ],
                  "recommendation": [
                    "recommendation 1",
                    "recommendation 2"
                  ]
                }

                Rules:
                - summary must be a string.
                - possibleCause must be an array of strings.
                - recommendation must be an array of strings.
                - No markdown.
                - No code blocks.
                - No extra text.
                """
                .formatted(
                        monitor.getName(),
                        monitor.getUrl(),
                        uptime,
                        avgLatency,
                        incidents,
                        history.isBlank()
                                ? "No detailed history available."
                                : history
                );

        try {

            String rawResponse = chatModel.call(prompt);

            String cleanedResponse = rawResponse
                    .replace("```json", "")
                    .replace("```", "")
                    .replaceAll("(?i)^\\s*json\\s*", "")
                    .trim();

            System.out.println("=== Raw AI Response ===");
            System.out.println(rawResponse);

            System.out.println("=== Cleaned Response ===");
            System.out.println(cleanedResponse);

            return mapper.readValue(cleanedResponse, AIInsightResponse.class);

        } catch (Exception e) {

            e.printStackTrace();

            return new AIInsightResponse(
                    "Unable to generate complete analysis at this moment.",
                    List.of("There was an issue processing the AI response."),
                    List.of("Please try again in a few moments.")
            );
        }
    }
}