package com.apexplatform.api.tenants;

import com.apexplatform.api.audit.AuditLogService;
import com.apexplatform.api.memberships.Membership;
import com.apexplatform.api.memberships.MembershipRepository;
import com.apexplatform.api.security.ApexPrincipal;
import com.apexplatform.api.tenants.dto.TenantCreateRequest;
import com.apexplatform.api.tenants.dto.TenantResponse;
import com.apexplatform.api.tenants.dto.TenantUpdateRequest;
import com.apexplatform.api.users.User;
import com.apexplatform.api.users.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tenants")
public class TenantsController {

  private final TenantRepository tenantRepo;
  private final UserRepository userRepo;
  private final MembershipRepository membershipRepo;
  private final AuditLogService auditLogService;

  public TenantsController(
      TenantRepository tenantRepo,
      UserRepository userRepo,
      MembershipRepository membershipRepo,
      AuditLogService auditLogService
  ) {
    this.tenantRepo = tenantRepo;
    this.userRepo = userRepo;
    this.membershipRepo = membershipRepo;
    this.auditLogService = auditLogService;
  }

  @GetMapping
  public List<TenantResponse> list(Authentication auth) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    User user = userRepo.findById(p.userId()).orElseThrow(() -> new IllegalArgumentException("User not found"));
    return membershipRepo.findAllByUser(user).stream()
        .map(Membership::getTenant)
        .map(this::toDto)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
  public TenantResponse create(Authentication auth, HttpServletRequest httpReq, @Valid @RequestBody TenantCreateRequest req) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    User user = userRepo.findById(p.userId()).orElseThrow(() -> new IllegalArgumentException("User not found"));

    String name = req.name().trim();
    if (tenantRepo.findByName(name).isPresent()) {
      throw new IllegalArgumentException("Tenant already exists: " + name);
    }

    Tenant t = new Tenant();
    t.setName(name);
    t.setIndustry(req.industry());
    t.setUseCase(req.useCase());
    t.setPreferencesJson(req.preferencesJson());
    t = tenantRepo.save(t);

    Membership m = new Membership();
    m.setTenant(t);
    m.setUser(user);
    m.setRole("OWNER");
    membershipRepo.save(m);

    auditLogService.record(p, httpReq, "TENANT_CREATE", "tenant", t.getId(), true, Map.of("name", t.getName()));
    return toDto(t);
  }

  @GetMapping("/{id}")
  public TenantResponse get(Authentication auth, @PathVariable UUID id) {
    // Must be a member
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    if (!p.tenantId().equals(id)) {
      // Phase 1: principal has one tenant; later: support tenant switching via header or selection
      throw new IllegalArgumentException("Not authorized for tenant");
    }
    Tenant t = tenantRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Tenant not found"));
    return toDto(t);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
  public TenantResponse update(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id, @Valid @RequestBody TenantUpdateRequest req) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    if (!p.tenantId().equals(id)) {
      throw new IllegalArgumentException("Not authorized for tenant");
    }

    Tenant t = tenantRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Tenant not found"));
    if (req.name() != null && !req.name().trim().isBlank()) t.setName(req.name().trim());
    if (req.industry() != null) t.setIndustry(req.industry());
    if (req.useCase() != null) t.setUseCase(req.useCase());
    if (req.preferencesJson() != null) t.setPreferencesJson(req.preferencesJson());

    t = tenantRepo.save(t);
    auditLogService.record(p, httpReq, "TENANT_UPDATE", "tenant", t.getId(), true, Map.of());
    return toDto(t);
  }

  private TenantResponse toDto(Tenant t) {
    return new TenantResponse(t.getId(), t.getName(), t.getIndustry(), t.getUseCase());
  }
}

