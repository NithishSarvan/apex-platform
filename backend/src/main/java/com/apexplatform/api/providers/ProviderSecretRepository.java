package com.apexplatform.api.providers;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderSecretRepository extends JpaRepository<ProviderSecret, UUID> {
  Optional<ProviderSecret> findByProvider(Provider provider);
}

