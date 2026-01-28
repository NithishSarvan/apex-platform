package com.apexplatform.api.tenants.dto;

public record TenantUpdateRequest(
    String name,
    String industry,
    String useCase,
    String preferencesJson
) {}

