package com.apexplatform.api.chat.dto;

import java.time.Instant;
import java.util.UUID;

public record ChatResponse(
    UUID id,
    UUID modelId,
    String modelName,
    String providerName,
    String providerLogoUrl,
    String title,
    Instant createdAt
) {}

