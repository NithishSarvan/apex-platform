package com.apexplatform.api.providers.dto;

import java.util.UUID;

public record ProviderResponse(
    UUID id,
    String name,
    String description,
    int modelCount,
    String logoUrl,
    String type,
    String status,
    String baseUrl,
    String metadataJson,
    boolean hasSecret
) {}

