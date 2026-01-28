package com.apexplatform.api.models.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record ModelCreateRequest(
    @NotBlank String name,
    UUID providerId,
    String modelKey,
    String type,
    String status,
    String endpointUrl,
    String configJson
) {}

