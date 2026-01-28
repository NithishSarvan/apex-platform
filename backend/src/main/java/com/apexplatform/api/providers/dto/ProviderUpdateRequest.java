package com.apexplatform.api.providers.dto;

import jakarta.validation.constraints.Min;

public record ProviderUpdateRequest(
    String name,
    String description,
    @Min(0) Integer modelCount,
    String logoUrl,
    String type,
    String status,
    String baseUrl,
    String metadataJson,
    String apiKey
) {}

