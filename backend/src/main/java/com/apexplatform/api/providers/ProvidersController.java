package com.apexplatform.api.providers;

import com.apexplatform.api.providers.dto.ProviderCreateRequest;
import com.apexplatform.api.providers.dto.ProviderResponse;
import com.apexplatform.api.providers.dto.ProviderUpdateRequest;
import com.apexplatform.api.audit.AuditLogService;
import com.apexplatform.api.security.ApexPrincipal;
import com.apexplatform.api.security.CryptoService;
import com.apexplatform.api.tenants.Tenant;
import com.apexplatform.api.tenants.TenantRepository;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/providers")
public class ProvidersController {

  private final ProviderRepository providerRepo;
  private final TenantRepository tenantRepo;
  private final AuditLogService auditLogService;
  private final ProviderSecretRepository providerSecretRepo;
  private final CryptoService cryptoService;

  public ProvidersController(
      ProviderRepository providerRepo,
      TenantRepository tenantRepo,
      AuditLogService auditLogService,
      ProviderSecretRepository providerSecretRepo,
      CryptoService cryptoService
  ) {
    this.providerRepo = providerRepo;
    this.tenantRepo = tenantRepo;
    this.auditLogService = auditLogService;
    this.providerSecretRepo = providerSecretRepo;
    this.cryptoService = cryptoService;
  }

  @GetMapping
  public List<ProviderResponse> list(Authentication auth) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    return providerRepo.findAllByTenantOrderByNameAsc(tenant).stream()
        .map(this::toDto)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ProviderResponse create(Authentication auth, HttpServletRequest httpReq, @Valid @RequestBody ProviderCreateRequest req) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());

    String name = req.name().trim();
    if (providerRepo.existsByTenantAndName(tenant, name)) {
      throw new IllegalArgumentException("Provider already exists: " + name);
    }

    Provider provider = new Provider();
    provider.setTenant(tenant);
    provider.setName(name);
    provider.setDescription(req.description());
    provider.setModelCount(req.modelCount() == null ? 0 : req.modelCount());
    provider.setLogoUrl(req.logoUrl());
    provider.setType(req.type());
    provider.setStatus(req.status() == null || req.status().isBlank() ? "ACTIVE" : req.status());
    provider.setBaseUrl(req.baseUrl());
    provider.setMetadataJson(req.metadataJson());

    provider = providerRepo.save(provider);

    if (req.apiKey() != null && !req.apiKey().isBlank()) {
      ProviderSecret secret = providerSecretRepo.findByProvider(provider).orElseGet(ProviderSecret::new);
      secret.setProvider(provider);
      secret.setEncryptedSecret(cryptoService.encryptToBase64(req.apiKey()));
      providerSecretRepo.save(secret);
    }

    auditLogService.record(p, httpReq, "PROVIDER_CREATE", "provider", provider.getId(), true, Map.of("name", provider.getName()));
    return toDto(provider);
  }

  @GetMapping("/{id}")
  public ProviderResponse get(Authentication auth, @PathVariable UUID id) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    Provider provider = providerRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Provider not found"));
    return toDto(provider);
  }

  @PutMapping("/{id}")
  public ProviderResponse update(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id, @Valid @RequestBody ProviderUpdateRequest req) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    Provider provider = providerRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Provider not found"));

    if (req.name() != null && !req.name().trim().isBlank()) {
      provider.setName(req.name().trim());
    }
    if (req.description() != null) {
      provider.setDescription(req.description());
    }
    if (req.modelCount() != null) {
      provider.setModelCount(req.modelCount());
    }
    if (req.logoUrl() != null) {
      provider.setLogoUrl(req.logoUrl());
    }
    if (req.type() != null) {
      provider.setType(req.type());
    }
    if (req.status() != null) {
      provider.setStatus(req.status());
    }
    if (req.baseUrl() != null) {
      provider.setBaseUrl(req.baseUrl());
    }
    if (req.metadataJson() != null) {
      provider.setMetadataJson(req.metadataJson());
    }
    if (req.apiKey() != null && !req.apiKey().isBlank()) {
      ProviderSecret secret = providerSecretRepo.findByProvider(provider).orElseGet(ProviderSecret::new);
      secret.setProvider(provider);
      secret.setEncryptedSecret(cryptoService.encryptToBase64(req.apiKey()));
      providerSecretRepo.save(secret);
    }

    provider = providerRepo.save(provider);
    auditLogService.record(p, httpReq, "PROVIDER_UPDATE", "provider", provider.getId(), true, Map.of());
    return toDto(provider);
  }

  @PostMapping("/{id}/test")
  public Map<String, Object> test(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    Provider provider = providerRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Provider not found"));

    boolean hasSecret = providerSecretRepo.findByProvider(provider).isPresent();
    boolean ok = hasSecret && provider.getStatus() != null && !provider.getStatus().isBlank();
    auditLogService.record(p, httpReq, "PROVIDER_TEST", "provider", provider.getId(), ok, Map.of("hasSecret", hasSecret));

    return Map.of(
        "providerId", provider.getId(),
        "ok", ok,
        "message", ok ? "Provider configuration looks valid (Phase 1 placeholder)" : "Missing secret or status"
    );
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    Provider provider = providerRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Provider not found"));
    providerRepo.delete(provider);
    auditLogService.record(p, httpReq, "PROVIDER_DELETE", "provider", provider.getId(), true, Map.of("name", provider.getName()));
  }

  private ProviderResponse toDto(Provider provider) {
    boolean hasSecret = providerSecretRepo.findByProvider(provider).isPresent();
    return new ProviderResponse(
        provider.getId(),
        provider.getName(),
        provider.getDescription(),
        provider.getModelCount(),
        provider.getLogoUrl(),
        provider.getType(),
        provider.getStatus(),
        provider.getBaseUrl(),
        provider.getMetadataJson(),
        hasSecret
    );
  }
}

