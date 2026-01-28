package com.apexplatform.api.chat;

import com.apexplatform.api.tenants.Tenant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, UUID> {
  List<Chat> findAllByTenantOrderByCreatedAtDesc(Tenant tenant);
  Page<Chat> findAllByTenant(Tenant tenant, Pageable pageable);
  Optional<Chat> findByIdAndTenant(UUID id, Tenant tenant);
}

