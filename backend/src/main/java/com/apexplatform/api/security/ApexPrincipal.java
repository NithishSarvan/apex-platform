package com.apexplatform.api.security;

import java.util.UUID;

public record ApexPrincipal(
    UUID userId,
    UUID tenantId,
    String email,
    String role,
    String jti
) {}

