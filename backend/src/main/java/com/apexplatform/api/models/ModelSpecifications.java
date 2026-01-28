package com.apexplatform.api.models;

import com.apexplatform.api.tenants.Tenant;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class ModelSpecifications {
  private ModelSpecifications() {}

  public static Specification<Model> tenantIs(Tenant tenant) {
    return (root, query, cb) -> cb.equal(root.get("tenant"), tenant);
  }

  public static Specification<Model> providerIdIs(UUID providerId) {
    return (root, query, cb) -> cb.equal(root.get("provider").get("id"), providerId);
  }

  public static Specification<Model> typeIs(String type) {
    return (root, query, cb) -> cb.equal(cb.upper(root.get("type")), type.toUpperCase());
  }

  public static Specification<Model> nameContains(String q) {
    String like = "%" + q.toLowerCase() + "%";
    return (root, query, cb) -> cb.like(cb.lower(root.get("name")), like);
  }
}

