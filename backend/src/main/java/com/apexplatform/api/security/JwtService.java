package com.apexplatform.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final JwtProperties props;
  private final SecretKey key;

  public JwtService(JwtProperties props) {
    this.props = props;
    this.key = Keys.hmacShaKeyFor(props.secret().getBytes(StandardCharsets.UTF_8));
  }

  public String issueToken(ApexPrincipal principal) {
    Instant now = Instant.now();
    Instant exp = now.plus(props.expiresMinutes(), ChronoUnit.MINUTES);

    return Jwts.builder()
        .issuer(props.issuer())
        .id(principal.jti())
        .subject(principal.userId().toString())
        .issuedAt(Date.from(now))
        .expiration(Date.from(exp))
        .claim("tenantId", principal.tenantId().toString())
        .claim("email", principal.email())
        .claim("role", principal.role())
        .signWith(key)
        .compact();
  }

  public ApexPrincipal parse(String token) {
    Claims claims = Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();

    UUID userId = UUID.fromString(claims.getSubject());
    UUID tenantId = UUID.fromString(claims.get("tenantId", String.class));
    String email = claims.get("email", String.class);
    String role = claims.get("role", String.class);
    String jti = claims.getId();
    return new ApexPrincipal(userId, tenantId, email, role, jti);
  }
}

