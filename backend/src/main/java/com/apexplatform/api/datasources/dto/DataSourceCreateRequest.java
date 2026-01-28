package com.apexplatform.api.datasources.dto;

import jakarta.validation.constraints.NotBlank;

public record DataSourceCreateRequest(
    @NotBlank String name,
    @NotBlank String type,
    String connectionString,
    String endpointUrl
) {}

