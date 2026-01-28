package com.apexplatform.api.me;

import com.apexplatform.api.security.ApexPrincipal;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MeController {

  @GetMapping("/me")
  public Map<String, Object> me(Authentication auth) {
    ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
    return Map.of(
        "userId", p.userId(),
        "tenantId", p.tenantId(),
        "email", p.email(),
        "role", p.role()
    );
  }
}

