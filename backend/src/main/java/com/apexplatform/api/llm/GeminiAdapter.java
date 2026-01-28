package com.apexplatform.api.llm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

/**
 * Gemini (Google AI Studio) adapter.
 *
 * API shape (v1beta):
 * POST {base}/models/{modelKey}:generateContent
 * Auth: x-goog-api-key: {API_KEY}
 */
@Component
public class GeminiAdapter implements LlmAdapter {
  private final RestClient restClient;
  private final ObjectMapper objectMapper;

  public GeminiAdapter(RestClient.Builder restClientBuilder, ObjectMapper objectMapper) {
    this.restClient = restClientBuilder.build();
    this.objectMapper = objectMapper;
  }

  @Override
  public boolean supports(String providerType) {
    if (providerType == null) return false;
    return providerType.trim().toUpperCase().contains("GEMINI");
  }

  @Override
  public LlmResponse generate(LlmRequest request) {
    if (request.providerApiKey() == null || request.providerApiKey().isBlank()) {
      throw new IllegalArgumentException("Provider API key not configured");
    }
    if (request.modelKey() == null || request.modelKey().isBlank()) {
      throw new IllegalArgumentException("Model 'modelKey' is required for Gemini");
    }

    String url = generateContentUrl(request.providerBaseUrl(), request.modelKey());

    Map<String, Object> payload = new HashMap<>();
    payload.put("contents", List.of(
        Map.of(
            "role", "user",
            "parts", List.of(Map.of("text", request.prompt()))
        )
    ));

    Integer maxOutputTokens = parseIntField(request.configJson(), "maxOutputTokens");
    if (maxOutputTokens != null) {
      payload.put("generationConfig", Map.of("maxOutputTokens", maxOutputTokens));
    }

    final String raw;
    try {
      raw = restClient.post()
          .uri(URI.create(url))
          .contentType(MediaType.APPLICATION_JSON)
          .header("x-goog-api-key", request.providerApiKey())
          .body(payload)
          .retrieve()
          .body(String.class);
    } catch (HttpStatusCodeException e) {
      throw e; // handled as 502 with upstream body
    } catch (ResourceAccessException e) {
      throw new IllegalArgumentException("LLM provider unreachable: " + e.getMessage());
    }

    String content = extractText(raw);
    // Gemini v1beta responses may include token counts under usageMetadata.*TokenCount depending on model/features.
    Integer promptTokens = extractGeminiUsageInt(raw, "promptTokenCount");
    Integer completionTokens = extractGeminiUsageInt(raw, "candidatesTokenCount");
    Integer totalTokens = extractGeminiUsageInt(raw, "totalTokenCount");
    return new LlmResponse(content, promptTokens, completionTokens, totalTokens);
  }

  private String generateContentUrl(String providerBaseUrl, String modelKey) {
    String base = (providerBaseUrl == null || providerBaseUrl.isBlank())
        ? "https://generativelanguage.googleapis.com/v1beta"
        : providerBaseUrl.trim();

    base = base.replaceAll("/+$", "");
    if (!base.endsWith("/v1beta") && !base.contains("/v1beta/")) {
      base = base + "/v1beta";
    }

    String encModel = URLEncoder.encode(modelKey, StandardCharsets.UTF_8);
    return base + "/models/" + encModel + ":generateContent";
  }

  private String extractText(String raw) {
    if (raw == null) return "";
    try {
      JsonNode root = objectMapper.readTree(raw);
      JsonNode candidates = root.path("candidates");
      if (candidates.isArray() && !candidates.isEmpty()) {
        JsonNode parts = candidates.get(0).path("content").path("parts");
        if (parts.isArray()) {
          StringBuilder sb = new StringBuilder();
          for (JsonNode p : parts) {
            JsonNode t = p.get("text");
            if (t != null && t.isTextual()) {
              if (!sb.isEmpty()) sb.append("\n");
              sb.append(t.asText());
            }
          }
          if (!sb.isEmpty()) return sb.toString();
        }
      }
      return raw;
    } catch (Exception e) {
      return raw;
    }
  }

  private Integer extractGeminiUsageInt(String raw, String field) {
    if (raw == null || raw.isBlank()) return null;
    try {
      JsonNode root = objectMapper.readTree(raw);
      JsonNode usage = root.path("usageMetadata");
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

