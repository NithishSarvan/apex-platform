package com.apexplatform.api.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.crypto")
public record CryptoProperties(
    String encryptionKey
) {}

