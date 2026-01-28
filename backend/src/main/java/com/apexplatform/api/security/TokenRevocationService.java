package com.apexplatform.api.security;

import java.time.Duration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class TokenRevocationService {
  private static final String PREFIX = "revoked:jti:";

  private final StringRedisTemplate redis;

  public TokenRevocationService(StringRedisTemplate redis) {
    this.redis = redis;
  }

  public void revoke(String jti, Duration ttl) {
    if (jti == null || jti.isBlank()) return;
    redis.opsForValue().set(PREFIX + jti, "1", ttl);
  }

  public boolean isRevoked(String jti) {
    if (jti == null || jti.isBlank()) return false;
    Boolean exists = redis.hasKey(PREFIX + jti);
    return Boolean.TRUE.equals(exists);
  }
}

