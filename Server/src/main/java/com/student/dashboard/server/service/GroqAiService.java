package com.student.dashboard.server.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.student.dashboard.server.dto.AiChatRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GroqAiService {

    private static final Logger log = LoggerFactory.getLogger(GroqAiService.class);
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${app.groq.model:llama3-70b-8192}")
    private String modelName;

    public GroqAiService(@Value("${app.groq.api.key:}") String apiKey, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.groq.com/openai/v1/chat/completions")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public String generateChatResponse(List<AiChatRequest.AiChatMessage> messages) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);

            String response = restClient.post()
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            log.error("Failed to call Groq API for chat", e);
            return "I'm sorry, I am currently unable to process your request. Please ensure the Groq API key is configured properly.";
        }
    }

    public FeedbackResult generateFeedbackAndScore(String assignmentTitle, String assignmentDescription, String submissionContent) {
        try {
            String systemPrompt = "You are an expert technical mentor evaluating a mentee's project. " +
                    "Project Title: " + assignmentTitle + "\n" +
                    "Project Description: " + assignmentDescription + "\n\n" +
                    "Mentee's Submission:\n" + submissionContent + "\n\n" +
                    "Evaluate the submission. Provide constructive feedback (1-3 paragraphs) and a final integer score from 0 to 100. " +
                    "Your response MUST end with exactly this format: \nSCORE: <integer>";

            List<AiChatRequest.AiChatMessage> messages = new ArrayList<>();
            messages.add(new AiChatRequest.AiChatMessage("system", systemPrompt));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.3); // Lower temp for evaluation

            String response = restClient.post()
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            String aiContent = root.path("choices").get(0).path("message").path("content").asText();

            // Parse SCORE: <integer>
            int score = 70; // fallback
            String feedback = aiContent;

            Pattern pattern = Pattern.compile("SCORE:\\s*(\\d+)");
            Matcher matcher = pattern.matcher(aiContent);
            if (matcher.find()) {
                score = Integer.parseInt(matcher.group(1));
                feedback = aiContent.substring(0, matcher.start()).trim();
            }

            return new FeedbackResult(score, feedback);
        } catch (Exception e) {
            log.error("Failed to call Groq API for feedback", e);
            return new FeedbackResult(60, "AI Feedback could not be generated due to a server configuration issue.");
        }
    }

    public static class FeedbackResult {
        private final int score;
        private final String feedback;

        public FeedbackResult(int score, String feedback) {
            this.score = score;
            this.feedback = feedback;
        }

        public int getScore() { return score; }
        public String getFeedback() { return feedback; }
    }
}
