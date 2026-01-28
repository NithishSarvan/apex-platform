package com.apexplatform.api.llm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;

/**
 * Real provider adapter for OpenAI-compatible Chat Completions APIs.
 *
 * Supports providers like OpenAI, DeepSeek, Groq, etc., as long as they follow:
 * POST {baseUrl}/chat/completions with OpenAI-style payload/response.
 */
@Component
public class OpenAiCompatibleChatAdapter implements LlmAdapter {

  private final RestClient restClient;
  private final ObjectMapper objectMapper;

  public OpenAiCompatibleChatAdapter(
      RestClient.Builder restClientBuilder,
      ObjectMapper objectMapper
  ) {
    this.restClient = restClientBuilder.build();
    this.objectMapper = objectMapper;
  }

  @Override
  public boolean supports(String providerType) {
    if (providerType == null) return false;
    String t = providerType.trim().toUpperCase();
    // Keep this flexible; UI may store custom types.
    return t.contains("OPENAI") || t.contains("DEEPSEEK") || t.contains("GROQ") || t.contains("COMPAT");
  }

  @Override
  public LlmResponse generate(LlmRequest request) {
    if (request.providerApiKey() == null || request.providerApiKey().isBlank()) {
      throw new IllegalArgumentException("Provider API key not configured");
    }
    String url = chatCompletionsUrl(request.providerType(), request.providerBaseUrl());

    Map<String, Object> payload = new HashMap<>();
    String model = (request.modelKey() != null && !request.modelKey().isBlank())
        ? request.modelKey()
        : request.modelName();
    if (model == null || model.isBlank()) {
      throw new IllegalArgumentException("Model key/name not configured");
    }
    payload.put("model", model);
    payload.put("messages", List.of(Map.of("role", "user", "content", request.prompt())));
    payload.put("stream", false);

    Integer maxTokens = parseIntField(request.configJson(), "maxOutputTokens");
    if (maxTokens != null) payload.put("max_tokens", maxTokens);

    final String raw;
    try {
      raw = restClient.post()
          .uri(URI.create(url))
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + request.providerApiKey())
          .body(payload)
          .retrieve()
          .body(String.class);
    } catch (HttpStatusCodeException e) {
      // Let GlobalExceptionHandler map this to 502 with upstream body for debugging.
      throw e;
    } catch (ResourceAccessException e) {
      throw new IllegalArgumentException("LLM provider unreachable: " + e.getMessage());
    }

    String content = extractAssistantContent(raw);
    Integer promptTokens = extractUsageInt(raw, "prompt_tokens");
    Integer completionTokens = extractUsageInt(raw, "completion_tokens");
    Integer totalTokens = extractUsageInt(raw, "total_tokens");
    return new LlmResponse(content, promptTokens, completionTokens, totalTokens);
  }

  private String chatCompletionsUrl(String providerType, String providerBaseUrl) {
    String base = providerBaseUrl;
    String type = providerType == null ? "" : providerType.trim().toUpperCase();
    if (base == null || base.isBlank()) {
      if ("DEEPSEEK".equals(type)) base = "https://api.deepseek.com/v1";
      else base = "https://api.openai.com/v1";
    }
    base = base.replaceAll("/+$", "");
    if (base.endsWith("/chat/completions")) {
      return base;
    }

    // Normalize OpenAI-compatible base URLs:
    // - If user stores https://api.deepseek.com (no /v1), we must call /v1/chat/completions
    // - If user stores https://api.deepseek.com/v1, we call /v1/chat/completions
    // - If user stores full endpoint, we already returned above.
    if (!base.endsWith("/v1") && !base.contains("/v1/")) {
      base = base + "/v1";
    }

    return base + "/chat/completions";
  }

  private String extractAssistantContent(String raw) {
    if (raw == null) return "";
    try {
      JsonNode root = objectMapper.readTree(raw);
      JsonNode choices = root.path("choices");
      if (choices.isArray() && !choices.isEmpty()) {
        JsonNode msg = choices.get(0).path("message").path("content");
        if (!msg.isMissingNode()) return msg.asText("");
        JsonNode text = choices.get(0).path("text");
        if (!text.isMissingNode()) return text.asText("");
      }
      return raw;
    } catch (Exception e) {
      return raw;
    }
  }

  private Integer extractUsageInt(String raw, String field) {
    if (raw == null || raw.isBlank()) return null;
    try {
      JsonNode root = objectMapper.readTree(raw);
      JsonNode usage = root.path("usage");
      if (usage.isMissingNode() || usage.isNull()) return null;
      JsonNode n = usage.get(field);
      if (n == null || n.isNull()) return null;
      if (n.isInt()) return n.intValue();
      if (n.isLong()) return (int) n.longValue();
      if (n.isTextual()) {
        String s = n.asText("").trim();
        if (s.isBlank()) return null;
        String digits = s.replaceAll("[^0-9]", "");
        if (digits.isBlank()) return null;
        return Integer.parseInt(digits);
      }
      return null;
    } catch (Exception e) {
      return null;
    }
  }

  private Integer parseIntField(String json, String field) {
    if (json == null || json.isBlank()) return null;
    try {
      JsonNode root = objectMapper.readTree(json);
      JsonNode n = root.get(field);
      if (n == null || n.isNull()) return null;
      if (n.isInt()) return n.intValue();
      if (n.isTextual()) {
        String s = n.asText().trim();
        if (s.isBlank()) return null;
        // tolerate values like "16,384 tokens"
        String digits = s.replaceAll("[^0-9]", "");
        if (digits.isBlank()) return null;
        return Integer.parseInt(digits);
      }
      return null;
    } catch (Exception e) {
      return null;
    }
  }
}

