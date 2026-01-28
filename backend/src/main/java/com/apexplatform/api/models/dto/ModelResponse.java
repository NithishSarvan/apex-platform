package com.apexplatform.api.models.dto;

import java.util.UUID;

public record ModelResponse(
    UUID id,
    String name,
    UUID providerId,
    String providerName,
    String providerLogoUrl,
    String modelKey,
    String type,
    String status,
    String endpointUrl,
    String configJson
) {}

