package com.apexplatform.api.models.dto;

import java.util.UUID;

public record ModelUpdateRequest(
    String name,
    UUID providerId,
    String modelKey,
    String type,
    String status,
    String endpointUrl,
    String configJson
) {}

