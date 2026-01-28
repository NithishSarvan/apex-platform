package com.apexplatform.api.models;

import com.apexplatform.api.providers.Provider;
import com.apexplatform.api.tenants.Tenant;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "models")
public class Model {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "tenant_id", nullable = false)
  private Tenant tenant;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "provider_id")
  private Provider provider;

  @Column(nullable = false)
  private String name;

  @Column(name = "model_key")
  private String modelKey;

  @Column(nullable = false)
  private String type; // API | SELF

  @Column(nullable = false)
  private String status; // ACTIVE | INACTIVE

  @Column(name = "endpoint_url")
  private String endpointUrl;

  @Column(name = "config_json", columnDefinition = "jsonb")
  @ColumnTransformer(read = "config_json::text", write = "?::jsonb")
  private String configJson;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public UUID getId() {
    return id;
  }

  public Tenant getTenant() {
    return tenant;
  }

  public void setTenant(Tenant tenant) {
    this.tenant = tenant;
  }

  public Provider getProvider() {
    return provider;
  }

  public void setProvider(Provider provider) {
    this.provider = provider;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getModelKey() {
    return modelKey;
  }

  public void setModelKey(String modelKey) {
    this.modelKey = modelKey;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getEndpointUrl() {
    return endpointUrl;
  }

  public void setEndpointUrl(String endpointUrl) {
    this.endpointUrl = endpointUrl;
  }

  public String getConfigJson() {
    return configJson;
  }

  public void setConfigJson(String configJson) {
    this.configJson = configJson;
  }
}

