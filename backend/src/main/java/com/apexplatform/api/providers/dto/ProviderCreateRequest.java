package com.apexplatform.api.providers.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ProviderCreateRequest(
    @NotBlank String name,
    String description,
    @Min(0) Integer modelCount,
    String logoUrl,
    String type,
    String status,
    String baseUrl,
    String metadataJson,
    String apiKey
) {}

