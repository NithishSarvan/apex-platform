package com.apexplatform.api.datasources;

import com.apexplatform.api.tenants.Tenant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataSourceRepository extends JpaRepository<DataSource, UUID> {
  List<DataSource> findAllByTenantOrderByNameAsc(Tenant tenant);
  Optional<DataSource> findByIdAndTenant(UUID id, Tenant tenant);
  boolean existsByTenantAndName(Tenant tenant, String name);
}

