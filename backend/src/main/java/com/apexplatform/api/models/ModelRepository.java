package com.apexplatform.api.models;

import com.apexplatform.api.tenants.Tenant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ModelRepository extends JpaRepository<Model, UUID>, JpaSpecificationExecutor<Model> {
  List<Model> findAllByTenantOrderByNameAsc(Tenant tenant);
  Optional<Model> findByIdAndTenant(UUID id, Tenant tenant);
}

