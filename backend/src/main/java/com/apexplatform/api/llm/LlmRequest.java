package com.apexplatform.api.llm;

import java.util.UUID;

public record LlmRequest(
    UUID modelId,
    String modelName,
    String modelKey,
    String providerType,
    String providerName,
    String providerBaseUrl,
    String providerApiKey,
    String prompt,
    String configJson
) {}

