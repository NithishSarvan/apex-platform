package com.apexplatform.api.tenants.dto;

import jakarta.validation.constraints.NotBlank;

public record TenantCreateRequest(
    @NotBlank String name,
    String industry,
    String useCase,
    String preferencesJson
) {}

