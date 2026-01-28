package com.apexplatform.api.llm;

public record LlmResponse(
    String content,
    Integer promptTokens,
    Integer completionTokens,
    Integer totalTokens
) {}

