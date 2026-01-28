package com.apexplatform.api.datasources;

import com.apexplatform.api.datasources.dto.DataSourceCreateRequest;
import com.apexplatform.api.datasources.dto.DataSourceResponse;
import com.apexplatform.api.datasources.dto.DataSourceUpdateRequest;
import com.apexplatform.api.audit.AuditLogService;
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

@RestController
@RequestMapping("/api/data-sources")
public class DataSourcesController {

  private final DataSourceRepository dataSourceRepo;
  private final TenantRepository tenantRepo;
  private final AuditLogService auditLogService;

  public DataSourcesController(DataSourceRepository dataSourceRepo, TenantRepository tenantRepo, AuditLogService auditLogService) {
    this.dataSourceRepo = dataSourceRepo;
    this.tenantRepo = tenantRepo;
    this.auditLogService = auditLogService;
  }

  @GetMapping
  public List<DataSourceResponse> list(Authentication auth) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    return dataSourceRepo.findAllByTenantOrderByNameAsc(tenant).stream()
        .map(this::toDto)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public DataSourceResponse create(Authentication auth, HttpServletRequest httpReq, @Valid @RequestBody DataSourceCreateRequest req) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());

    String name = req.name().trim();
    if (dataSourceRepo.existsByTenantAndName(tenant, name)) {
      throw new IllegalArgumentException("Data source already exists: " + name);
    }

    DataSource ds = new DataSource();
    ds.setTenant(tenant);
    ds.setName(name);
    ds.setType(req.type().trim().toUpperCase());
    ds.setConnectionString(req.connectionString());
    ds.setEndpointUrl(req.endpointUrl());
    ds.setStatus("DISCONNECTED");

    ds = dataSourceRepo.save(ds);
    auditLogService.record(p, httpReq, "DATA_SOURCE_CREATE", "data_source", ds.getId(), true, Map.of("name", ds.getName(), "type", ds.getType()));
    return toDto(ds);
  }

  @GetMapping("/{id}")
  public DataSourceResponse get(Authentication auth, @PathVariable UUID id) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    DataSource ds = dataSourceRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Data source not found"));
    return toDto(ds);
  }

  @PutMapping("/{id}")
  public DataSourceResponse update(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id, @Valid @RequestBody DataSourceUpdateRequest req) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    DataSource ds = dataSourceRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Data source not found"));

    if (req.name() != null && !req.name().trim().isBlank()) {
      ds.setName(req.name().trim());
    }
    if (req.type() != null && !req.type().trim().isBlank()) {
      ds.setType(req.type().trim().toUpperCase());
    }
    if (req.connectionString() != null) {
      ds.setConnectionString(req.connectionString());
    }
    if (req.endpointUrl() != null) {
      ds.setEndpointUrl(req.endpointUrl());
    }
    if (req.status() != null && !req.status().trim().isBlank()) {
      ds.setStatus(req.status().trim().toUpperCase());
    }

    ds = dataSourceRepo.save(ds);
    auditLogService.record(p, httpReq, "DATA_SOURCE_UPDATE", "data_source", ds.getId(), true, Map.of());
    return toDto(ds);
  }

  @PostMapping("/{id}/test")
  public DataSourceResponse testConnection(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id) {
    // Phase 1 (prototype-but-real backend): we simulate a connection test.
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    DataSource ds = dataSourceRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Data source not found"));

    ds.setStatus("CONNECTED");
    ds = dataSourceRepo.save(ds);
    auditLogService.record(p, httpReq, "DATA_SOURCE_TEST", "data_source", ds.getId(), true, Map.of("status", ds.getStatus()));
    return toDto(ds);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
    DataSource ds = dataSourceRepo.findByIdAndTenant(id, tenant)
        .orElseThrow(() -> new IllegalArgumentException("Data source not found"));
    dataSourceRepo.delete(ds);
    auditLogService.record(p, httpReq, "DATA_SOURCE_DELETE", "data_source", ds.getId(), true, Map.of("name", ds.getName()));
  }

  private DataSourceResponse toDto(DataSource ds) {
    return new DataSourceResponse(
        ds.getId(),
        ds.getName(),
        ds.getType(),
        ds.getConnectionString(),
        ds.getEndpointUrl(),
        ds.getStatus()
    );
  }
}

