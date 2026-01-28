package com.apexplatform.api.tenants;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "tenants")
public class Tenant {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, unique = true)
  private String name;

  @Column
  private String industry;

  @Column(name = "use_case")
  private String useCase;

  @Column(name = "preferences_json", columnDefinition = "jsonb")
  @JdbcTypeCode(SqlTypes.JSON)
  @ColumnTransformer(read = "preferences_json::text", write = "?::jsonb")
  private String preferencesJson;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getIndustry() {
    return industry;
  }

  public void setIndustry(String industry) {
    this.industry = industry;
  }

  public String getUseCase() {
    return useCase;
  }

  public void setUseCase(String useCase) {
    this.useCase = useCase;
  }

  public String getPreferencesJson() {
    return preferencesJson;
  }

  public void setPreferencesJson(String preferencesJson) {
    this.preferencesJson = preferencesJson;
  }
}

