package com.apexplatform.api.bootstrap;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.bootstrap")
public record BootstrapProperties(
    String defaultTenantName,
    String adminEmail,
    String adminPassword
) {}

