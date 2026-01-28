package com.apexplatform.api.auth.dto;

import java.util.UUID;

public record AuthResponse(
    String accessToken,
    UUID userId,
    UUID tenantId,
    String email,
    String role
) {}

