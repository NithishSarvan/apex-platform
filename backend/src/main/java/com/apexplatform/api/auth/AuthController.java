package com.apexplatform.api.auth;

import com.apexplatform.api.auth.dto.AuthLoginRequest;
import com.apexplatform.api.auth.dto.AuthRegisterRequest;
import com.apexplatform.api.auth.dto.AuthResponse;
import com.apexplatform.api.memberships.Membership;
import com.apexplatform.api.memberships.MembershipRepository;
import com.apexplatform.api.security.ApexPrincipal;
import com.apexplatform.api.security.JwtService;
import com.apexplatform.api.security.JwtProperties;
import com.apexplatform.api.security.TokenRevocationService;
import com.apexplatform.api.tenants.Tenant;
import com.apexplatform.api.tenants.TenantRepository;
import com.apexplatform.api.users.User;
import com.apexplatform.api.users.UserRepository;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final TenantRepository tenantRepo;
  private final UserRepository userRepo;
  private final MembershipRepository membershipRepo;
  private final PasswordEncoder encoder;
  private final JwtService jwtService;
  private final JwtProperties jwtProperties;
  private final TokenRevocationService tokenRevocationService;
  private final com.apexplatform.api.audit.AuditLogService auditLogService;

  public AuthController(
      TenantRepository tenantRepo,
      UserRepository userRepo,
      MembershipRepository membershipRepo,
      PasswordEncoder encoder,
      JwtService jwtService,
      JwtProperties jwtProperties,
      TokenRevocationService tokenRevocationService,
      com.apexplatform.api.audit.AuditLogService auditLogService
  ) {
    this.tenantRepo = tenantRepo;
    this.userRepo = userRepo;
    this.membershipRepo = membershipRepo;
    this.encoder = encoder;
    this.jwtService = jwtService;
    this.jwtProperties = jwtProperties;
    this.tokenRevocationService = tokenRevocationService;
    this.auditLogService = auditLogService;
  }

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthResponse register(@Valid @RequestBody AuthRegisterRequest req, HttpServletRequest httpReq) {
    if (userRepo.existsByEmail(req.email().toLowerCase())) {
      throw new IllegalArgumentException("Email already exists");
    }

    // Phase 1: register into the first/only tenant (Default Tenant).
    Tenant tenant = tenantRepo.findAll().stream().findFirst()
        .orElseThrow(() -> new IllegalArgumentException("No tenant found. Check bootstrap."));

    User u = new User();
    u.setTenant(tenant);
    u.setEmail(req.email().toLowerCase());
    u.setRole("ADMIN"); // keep for now; membership is tenant-scoped source of truth
    u.setPasswordHash(encoder.encode(req.password()));
    u = userRepo.save(u);

    Membership m = new Membership();
    m.setTenant(tenant);
    m.setUser(u);
    m.setRole("OWNER");
    membershipRepo.save(m);

    ApexPrincipal principal = new ApexPrincipal(u.getId(), tenant.getId(), u.getEmail(), m.getRole(), UUID.randomUUID().toString());
    String token = jwtService.issueToken(principal);

    auditLogService.record(principal, httpReq, "AUTH_REGISTER", "user", u.getId(), true, Map.of("email", u.getEmail()));
    return new AuthResponse(token, u.getId(), tenant.getId(), u.getEmail(), m.getRole());
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody AuthLoginRequest req, HttpServletRequest httpReq) {
    User u = userRepo.findByEmail(req.email().toLowerCase())
        .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

    if (!encoder.matches(req.password(), u.getPasswordHash())) {
      throw new IllegalArgumentException("Invalid credentials");
    }

    Tenant tenant = u.getTenant();
    Membership membership = membershipRepo.findFirstByUserOrderByCreatedAtAsc(u)
        .orElseThrow(() -> new IllegalArgumentException("No membership found for user"));
    ApexPrincipal principal = new ApexPrincipal(u.getId(), membership.getTenant().getId(), u.getEmail(), membership.getRole(), UUID.randomUUID().toString());
    String token = jwtService.issueToken(principal);
    auditLogService.record(principal, httpReq, "AUTH_LOGIN", "user", u.getId(), true, Map.of());
    return new AuthResponse(token, u.getId(), membership.getTenant().getId(), u.getEmail(), membership.getRole());
  }

  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(org.springframework.security.core.Authentication auth, HttpServletRequest httpReq) {
    ApexPrincipal principal = (ApexPrincipal) auth.getPrincipal();
    // blacklist token JTI until it naturally expires (Phase 1: fixed ttl based on configured token lifetime)
    Duration ttl = Duration.ofMinutes(Math.max(1, jwtProperties.expiresMinutes()));
    tokenRevocationService.revoke(principal.jti(), ttl);
    auditLogService.record(principal, httpReq, "AUTH_LOGOUT", "user", principal.userId(), true, Map.of());
  }
}

