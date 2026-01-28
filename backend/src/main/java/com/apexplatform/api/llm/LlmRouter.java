package com.apexplatform.api.llm;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class LlmRouter {
  private final List<LlmAdapter> adapters;

  public LlmRouter(List<LlmAdapter> adapters) {
    this.adapters = adapters;
  }

  public LlmResponse generate(LlmRequest req) {
    String providerType = req.providerType() == null ? "" : req.providerType();
    for (LlmAdapter a : adapters) {
      if (a.supports(providerType)) {
        return a.generate(req);
      }
    }
    throw new IllegalArgumentException("No LLM adapter available");
  }
}

