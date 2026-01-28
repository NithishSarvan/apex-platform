package com.apexplatform.api.datasources.dto;

import java.util.UUID;

public record DataSourceResponse(
    UUID id,
    String name,
    String type,
    String connectionString,
    String endpointUrl,
    String status
) {}

