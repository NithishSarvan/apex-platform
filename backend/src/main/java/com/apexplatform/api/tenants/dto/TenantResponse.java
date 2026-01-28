package com.apexplatform.api.tenants.dto;

import java.util.UUID;

public record TenantResponse(
    UUID id,
    String name,
    String industry,
    String useCase
) {}

