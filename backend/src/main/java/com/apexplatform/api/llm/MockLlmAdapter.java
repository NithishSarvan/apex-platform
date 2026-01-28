package com.apexplatform.api.llm;

import org.springframework.stereotype.Component;

@Component
public class MockLlmAdapter implements LlmAdapter {
  @Override
  public boolean supports(String providerType) {
    // Only used when explicitly requested
    if (providerType == null) return false;
    return "MOCK".equalsIgnoreCase(providerType.trim());
  }

  @Override
  public LlmResponse generate(LlmRequest request) {
    // Phase 1 implementation: deterministic mock response so UI is "functional".
    String configHint = request.configJson() == null || request.configJson().isBlank()
        ? "(default config)"
        : "(using model config)";

    String content =
        "Mock response from " + (request.providerName() == null ? "Provider" : request.providerName()) +
        " / " + (request.modelName() == null ? "Model" : request.modelName()) + " " + configHint + "\n\n" +
        "You said: " + request.prompt();

    // Approximate token usage (good enough for prototype UI).
    int promptTokens = estimateTokens(request.prompt());
    int completionTokens = estimateTokens(content);
    int totalTokens = promptTokens + completionTokens;

    return new LlmResponse(content, promptTokens, completionTokens, totalTokens);
  }

  private int estimateTokens(String s) {
    if (s == null || s.isBlank()) return 0;
    // Rough heuristic: ~4 chars/token on average for English-ish text.
    int chars = s.trim().length();
    return Math.max(1, (int) Math.ceil(chars / 4.0));
  }
}

