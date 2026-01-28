package com.apexplatform.api.datasources.dto;

public record DataSourceUpdateRequest(
    String name,
    String type,
    String connectionString,
    String endpointUrl,
    String status
) {}

