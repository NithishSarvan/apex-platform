package com.apexplatform.api.audit;

import com.apexplatform.api.security.ApexPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {
  private final AuditLogRepository repo;
  private final ObjectMapper objectMapper;

  public AuditLogService(AuditLogRepository repo, ObjectMapper objectMapper) {
    this.repo = repo;
    this.objectMapper = objectMapper;
  }

  public void record(
      ApexPrincipal principal,
      HttpServletRequest request,
      String action,
      String entityType,
      UUID entityId,
      boolean success,
      Map<String, Object> details
  ) {
    AuditLog log = new AuditLog();
    if (principal != null) {
      log.setTenantId(principal.tenantId());
      log.setActorUserId(principal.userId());
      log.setActorEmail(principal.email());
    }

    log.setAction(action);
    log.setEntityType(entityType);
    log.setEntityId(entityId);
    if (request != null) {
      log.setMethod(request.getMethod());
      log.setPath(request.getRequestURI());
      log.setIp(request.getRemoteAddr());
      log.setUserAgent(request.getHeader("User-Agent"));
    }
    log.setSuccess(success);
    if (details != null && !details.isEmpty()) {
      try {
        log.setDetailsJson(objectMapper.writeValueAsString(details));
      } catch (Exception ignored) {
        // don't block the request if audit serialization fails
      }
    }
    repo.save(log);
  }
}

