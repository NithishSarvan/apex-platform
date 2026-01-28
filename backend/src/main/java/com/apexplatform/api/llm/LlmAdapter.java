package com.apexplatform.api.llm;

public interface LlmAdapter {
  /**
   * @return true if this adapter can handle the provider type.
   */
  boolean supports(String providerType);

  /**
   * Generate a response (Phase 1: non-streaming).
   */
  LlmResponse generate(LlmRequest request);
}

