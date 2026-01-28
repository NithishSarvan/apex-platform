package com.apexplatform.api.models;

import com.apexplatform.api.models.dto.ModelCreateRequest;
import com.apexplatform.api.models.dto.ModelResponse;
import com.apexplatform.api.models.dto.ModelUpdateRequest;
import com.apexplatform.api.audit.AuditLogService;
import com.apexplatform.api.common.PageResponse;
import com.apexplatform.api.providers.Provider;
import com.apexplatform.api.providers.ProviderRepository;
import com.apexplatform.api.security.ApexPrincipal;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

@RestController
@RequestMapping("/api/models")
public class ModelsController {

  private final ModelRepository modelRepo;
  private final ProviderRepository providerRepo;
  private final TenantRepository tenantRepo;
  private final AuditLogService auditLogService;

  public ModelsController(ModelRepository modelRepo, ProviderRepository providerRepo, TenantRepository tenantRepo, AuditLogService auditLogService) {
    this.modelRepo = modelRepo;
    this.providerRepo = providerRepo;
    this.tenantRepo = tenantRepo;
    this.auditLogService = auditLogService;
  }

  @GetMapping
  public PageResponse<ModelResponse> list(
      Authentication auth,
      @RequestParam(required = false) UUID providerId,
      @RequestParam(required = false) String type,
      @RequestParam(required = false, name = "q") String query,
      @RequestParam(required = false, defaultValue = "1") int page,
      @RequestParam(required = false, defaultValue = "20") int pageSize
  ) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());

    int safePage = Math.max(1, page);
    int safePageSize = Math.min(100, Math.max(1, pageSize));

    Specification<Model> spec = Specification.where(ModelSpecifications.tenantIs(tenant));
    if (providerId != null) spec = spec.and(ModelSpecifications.providerIdIs(providerId));
    if (type != null && !type.isBlank()) spec = spec.and(ModelSpecifications.typeIs(type));
    if (query != null && !query.isBlank()) spec = spec.and(ModelSpecifications.nameContains(query));

    var pageable = PageRequest.of(safePage - 1, safePageSize, Sort.by("name").ascending());
    var result = modelRepo.findAll(spec, pageable);

    return new PageResponse<>(
        result.getContent().stream().map(this::toDto).toList(),
        result.getTotalElements(),
        safePage,
        safePageSize
    );
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ModelResponse create(Authentication auth, HttpServletRequest httpReq, @Valid @RequestBody ModelCreateRequest req) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());

    Model model = new Model();
    model.setTenant(tenant);
    model.setName(req.name().trim());
    model.setModelKey(req.modelKey());
    model.setType(req.type() == null || req.type().isBlank() ? "API" : req.type());
    model.setStatus(req.status() == null || req.status().isBlank() ? "ACTIVE" : req.status());
    model.setEndpointUrl(req.endpointUrl());
    if (req.configJson() != null) {
      String cfg = req.configJson();
      model.setConfigJson(cfg.isBlank() ? null : cfg);
    }

    if (req.providerId() != null) {
      Provider provider = providerRepo.findByIdAndTenant(req.providerId(), tenant)
          .orElseThrow(() -> new IllegalArgumentException("Provider not found"));
      model.setProvider(provider);
    }

    model = modelRepo.save(model);
    auditLogService.record(p, httpReq, "MODEL_CREATE", "model", model.getId(), true, Map.of("name", model.getName()));
    return toDto(model);
  }

  @GetMapping("/{id}")
  public ModelResponse get(Authentication auth, @PathVariable UUID id) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    Model model = modelRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Model not found"));
    return toDto(model);
  }

  @PutMapping("/{id}")
  public ModelResponse update(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id, @Valid @RequestBody ModelUpdateRequest req) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    Model model = modelRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Model not found"));

    if (req.name() != null && !req.name().trim().isBlank()) {
      model.setName(req.name().trim());
    }
    if (req.modelKey() != null) {
      model.setModelKey(req.modelKey());
    }
    if (req.type() != null && !req.type().isBlank()) {
      model.setType(req.type());
    }
    if (req.status() != null && !req.status().isBlank()) {
      model.setStatus(req.status());
    }
    if (req.endpointUrl() != null) {
      model.setEndpointUrl(req.endpointUrl());
    }
    if (req.configJson() != null) {
      String cfg = req.configJson();
      model.setConfigJson(cfg.isBlank() ? null : cfg);
    }
    if (req.providerId() != null) {
      Provider provider = providerRepo.findByIdAndTenant(req.providerId(), tenant)
          .orElseThrow(() -> new IllegalArgumentException("Provider not found"));
      model.setProvider(provider);
    }

    model = modelRepo.save(model);
    auditLogService.record(p, httpReq, "MODEL_UPDATE", "model", model.getId(), true, Map.of());
    return toDto(model);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    Model model = modelRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Model not found"));
    modelRepo.delete(model);
    auditLogService.record(p, httpReq, "MODEL_DELETE", "model", model.getId(), true, Map.of("name", model.getName()));
  }

  private ModelResponse toDto(Model model) {
    Provider provider = model.getProvider();
    return new ModelResponse(
        model.getId(),
        model.getName(),
        provider == null ? null : provider.getId(),
        provider == null ? null : provider.getName(),
        provider == null ? null : provider.getLogoUrl(),
        model.getModelKey(),
        model.getType(),
        model.getStatus(),
        model.getEndpointUrl(),
        model.getConfigJson()
    );
  }
}

