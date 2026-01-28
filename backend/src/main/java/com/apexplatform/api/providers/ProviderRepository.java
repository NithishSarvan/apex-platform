package com.apexplatform.api.providers;

import com.apexplatform.api.tenants.Tenant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository extends JpaRepository<Provider, UUID> {
  List<Provider> findAllByTenantOrderByNameAsc(Tenant tenant);
  Optional<Provider> findByIdAndTenant(UUID id, Tenant tenant);
  boolean existsByTenantAndName(Tenant tenant, String name);
}

