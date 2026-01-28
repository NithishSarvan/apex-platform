package com.apexplatform.api.chat;

import com.apexplatform.api.audit.AuditLogService;
import com.apexplatform.api.chat.dto.ChatMessageResponse;
import com.apexplatform.api.chat.dto.ChatResponse;
import com.apexplatform.api.chat.dto.CreateChatRequest;
import com.apexplatform.api.chat.dto.SendMessageRequest;
import com.apexplatform.api.llm.LlmRequest;
import com.apexplatform.api.llm.LlmRouter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.apexplatform.api.models.Model;
import com.apexplatform.api.models.ModelRepository;
import com.apexplatform.api.providers.Provider;
import com.apexplatform.api.providers.ProviderSecretRepository;
import com.apexplatform.api.security.ApexPrincipal;
import com.apexplatform.api.security.CryptoService;
import com.apexplatform.api.tenants.Tenant;
import com.apexplatform.api.tenants.TenantRepository;
import com.apexplatform.api.users.User;
import com.apexplatform.api.users.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.ArrayList;
import java.util.Collections;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final TenantRepository tenantRepo;
    private final UserRepository userRepo;
    private final ModelRepository modelRepo;
    private final ProviderSecretRepository providerSecretRepo;
    private final CryptoService cryptoService;
    private final ChatRepository chatRepo;
    private final ChatMessageRepository msgRepo;
    private final LlmRouter llmRouter;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    public ChatController(
            TenantRepository tenantRepo,
            UserRepository userRepo,
            ModelRepository modelRepo,
            ProviderSecretRepository providerSecretRepo,
            CryptoService cryptoService,
            ChatRepository chatRepo,
            ChatMessageRepository msgRepo,
            LlmRouter llmRouter,
            AuditLogService auditLogService,
            ObjectMapper objectMapper
    ) {
        this.tenantRepo = tenantRepo;
        this.userRepo = userRepo;
        this.modelRepo = modelRepo;
        this.providerSecretRepo = providerSecretRepo;
        this.cryptoService = cryptoService;
        this.chatRepo = chatRepo;
        this.msgRepo = msgRepo;
        this.llmRouter = llmRouter;
        this.auditLogService = auditLogService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChatResponse createChat(Authentication auth, HttpServletRequest httpReq, @RequestBody CreateChatRequest req) {
        ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
        Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
        User user = userRepo.findById(p.userId()).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Chat chat = new Chat();
        chat.setTenant(tenant);
        chat.setCreatedBy(user);
        chat.setTitle(req.title());

        Model model = null;
        if (req.modelId() != null) {
            model = modelRepo.findByIdAndTenant(req.modelId(), tenant)
                    .orElseThrow(() -> new IllegalArgumentException("Model not found"));
            chat.setModel(model);
        }

        chat = chatRepo.save(chat);
        auditLogService.record(p, httpReq, "CHAT_CREATE", "chat", chat.getId(), true, Map.of("modelId", req.modelId()));
        return toChatDto(chat);
    }

    @GetMapping
    public List<ChatResponse> listChats(
            Authentication auth,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "50") int pageSize
    ) {
        ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
        Tenant tenant = tenantRepo.getReferenceById(p.tenantId());

        int safePage = Math.max(1, page);
        int safePageSize = Math.min(200, Math.max(1, pageSize));

        var pageable = PageRequest.of(safePage - 1, safePageSize, Sort.by("createdAt").descending());
        return chatRepo.findAllByTenant(tenant, pageable)
                .getContent()
                .stream()
                .map(this::toChatDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ChatResponse getChat(Authentication auth, @PathVariable UUID id) {
        ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
        Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
        Chat chat = chatRepo.findByIdAndTenant(id, tenant)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));
        return toChatDto(chat);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteChat(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id) {
        ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
        Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
        Chat chat = chatRepo.findByIdAndTenant(id, tenant)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

        chatRepo.delete(chat); // messages cascade via FK (ON DELETE CASCADE)
        auditLogService.record(p, httpReq, "CHAT_DELETE", "chat", chat.getId(), true, Map.of());
    }

    @DeleteMapping("/{id}/messages")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void clearChatMessages(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id) {
        ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
        Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
        Chat chat = chatRepo.findByIdAndTenant(id, tenant)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

        msgRepo.deleteAllByChat(chat);
        auditLogService.record(p, httpReq, "CHAT_CLEAR", "chat", chat.getId(), true, Map.of());
    }

    @GetMapping("/{id}/messages")
    public List<ChatMessageResponse> listMessages(Authentication auth, @PathVariable UUID id) {
        ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
        Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
        Chat chat = chatRepo.findByIdAndTenant(id, tenant)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));
        // Backwards compatible default: return recent messages with paging controls for low-latency UI.
        return listMessages(auth, id, 1, 200, "asc");
    }

    @GetMapping("/{id}/messages/page")
    public List<ChatMessageResponse> listMessages(
            Authentication auth,
            @PathVariable UUID id,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "200") int pageSize,
            @RequestParam(required = false, defaultValue = "asc") String order
    ) {
        ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
        Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
        Chat chat = chatRepo.findByIdAndTenant(id, tenant)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

        int safePage = Math.max(1, page);
        int safePageSize = Math.min(500, Math.max(1, pageSize));
        boolean desc = order != null && order.trim().equalsIgnoreCase("desc");

        var sort = desc ? Sort.by("createdAt").descending() : Sort.by("createdAt").ascending();
        var pageable = PageRequest.of(safePage - 1, safePageSize, sort);
        var result = msgRepo.findAllByChat(chat, pageable).getContent();

        return result.stream()
                .map(m -> new ChatMessageResponse(m.getId(), m.getRole(), m.getContent(), m.getCreatedAt(), m.getMetadataJson()))
                .toList();
    }

    @PostMapping("/{id}/messages")
    public List<ChatMessageResponse> sendMessage(Authentication auth, HttpServletRequest httpReq, @PathVariable UUID id, @Valid @RequestBody SendMessageRequest req) {
        ApexPrincipal p = (ApexPrincipal) auth.getPrincipal();
        Tenant tenant = tenantRepo.getReferenceById(p.tenantId());
        Chat chat = chatRepo.findByIdAndTenant(id, tenant)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));

        if (req.content() == null || req.content().trim().isBlank()) {
            throw new IllegalArgumentException("Message content is required");
        }

        // Persist user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setChat(chat);
        userMsg.setRole("user");
        userMsg.setContent(req.content().trim());
        msgRepo.save(userMsg);

        Model model = chat.getModel();
        if (model == null) {
            throw new IllegalArgumentException("Chat has no model selected");
        }

    Provider provider = model.getProvider();
        if (provider == null) {
            throw new IllegalArgumentException("Model has no provider configured");
        }
    String providerType = provider.getType();
    if (providerType == null || providerType.isBlank()) {
      // Infer from provider name when type isn't set (keeps DB seed lightweight).
      String pn = provider.getName() == null ? "" : provider.getName().trim().toLowerCase();
      if (pn.contains("deepseek")) providerType = "DEEPSEEK";
      else if (pn.contains("openai")) providerType = "OPENAI";
      else if (pn.contains("gemini") || pn.contains("google")) providerType = "GEMINI";
      else providerType = "OPENAI_COMPAT";
    }
    if (model.getModelKey() == null || model.getModelKey().isBlank()) {
      throw new IllegalArgumentException("Model 'modelKey' is required for chat (vendor model id)");
    }

    // In your Phase-1 data model, base URL is stored on the model (endpointUrl),
    // while provider stores mainly API key / metadata. Prefer provider.baseUrl if present,
    // otherwise fall back to model.endpointUrl.
    String effectiveBaseUrl = provider.getBaseUrl();
    if (effectiveBaseUrl == null || effectiveBaseUrl.isBlank()) {
      effectiveBaseUrl = model.getEndpointUrl();
    }
        String providerApiKey = providerSecretRepo.findByProvider(provider)
                .map(s -> cryptoService.decryptFromBase64(s.getEncryptedSecret()))
                .filter(k -> !k.isBlank())
                .orElseThrow(() -> new IllegalArgumentException("Provider API key not configured"));
        String effectiveConfigJson = (req.overrideConfigJson() != null && !req.overrideConfigJson().isBlank())
                ? req.overrideConfigJson()
                : model.getConfigJson();

        // Build context from recent messages (Phase 1: simple concatenated prompt).
        String conversationPrompt = buildConversationPrompt(chat, effectiveConfigJson);

        var llmRes = llmRouter.generate(new LlmRequest(
                model.getId(),
                model.getName(),
                model.getModelKey(),
        providerType,
                provider == null ? null : provider.getName(),
        effectiveBaseUrl,
                providerApiKey,
                conversationPrompt,
                effectiveConfigJson
        ));

        // Persist assistant message
        ChatMessage assistantMsg = new ChatMessage();
        assistantMsg.setChat(chat);
        assistantMsg.setRole("assistant");
        assistantMsg.setContent(llmRes.content());

        // Attach token usage metadata when available
        try {
            var usage = new java.util.LinkedHashMap<String, Object>();
            Integer promptTokens = llmRes.promptTokens();
            Integer completionTokens = llmRes.completionTokens();
            Integer providerTotalTokens = llmRes.totalTokens();

            Integer computedTotalTokens = (promptTokens != null && completionTokens != null)
                ? (promptTokens + completionTokens)
                : null;

            if (promptTokens != null) usage.put("promptTokens", promptTokens);
            if (completionTokens != null) usage.put("completionTokens", completionTokens);

            // For display, prefer the computed total (prompt+completion) when both parts exist.
            // Some OpenAI-compatible providers report `total_tokens` inconsistently.
            Integer displayTotal = (computedTotalTokens != null) ? computedTotalTokens : providerTotalTokens;
            if (displayTotal != null) usage.put("totalTokens", displayTotal);

            if (providerTotalTokens != null && computedTotalTokens != null && !providerTotalTokens.equals(computedTotalTokens)) {
                usage.put("providerTotalTokens", providerTotalTokens);
            }

            // Context usage indicator (like ChatGPT UI): used/limit and percent.
            Integer contextLimit = parseIntField(effectiveConfigJson, "contextLength");
            Integer used = computedTotalTokens != null
                ? computedTotalTokens
                : estimateTokens(conversationPrompt) + estimateTokens(llmRes.content());
            if (contextLimit != null && contextLimit > 0) {
                double pct = Math.min(999.9, Math.max(0.0, (used * 100.0) / contextLimit));
                var ctx = new java.util.LinkedHashMap<String, Object>();
                ctx.put("usedTokens", used);
                ctx.put("limitTokens", contextLimit);
                ctx.put("usedPct", pct);
                usage.put("context", ctx);
            }
            if (!usage.isEmpty()) {
                assistantMsg.setMetadataJson(objectMapper.writeValueAsString(java.util.Map.of("usage", usage)));
            }
        } catch (Exception ignored) {
            // Do not fail the chat flow if metadata serialization fails.
        }
        msgRepo.save(assistantMsg);

        // Generate a short, ChatGPT-style title using the same model (only once per chat).
        // This keeps the left history list clean and avoids showing the whole first prompt.
        if (chat.getTitle() == null || chat.getTitle().trim().isBlank()) {
            try {
                String title = generateChatTitle(
                        providerType,
                        provider == null ? null : provider.getName(),
                        effectiveBaseUrl,
                        providerApiKey,
                        model,
                        userMsg.getContent()
                );
                if (title != null && !title.isBlank()) {
                    chat.setTitle(title);
                    chatRepo.save(chat);
                }
            } catch (Exception ignored) {
                // title generation is best-effort; never fail the chat call
            }
        }

        auditLogService.record(p, httpReq, "CHAT_MESSAGE", "chat", chat.getId(), true, Map.of("modelId", model.getId()));

        // Return only the newly created messages for low-latency UI (client can append).
        return List.of(
                new ChatMessageResponse(userMsg.getId(), userMsg.getRole(), userMsg.getContent(), userMsg.getCreatedAt(), userMsg.getMetadataJson()),
                new ChatMessageResponse(assistantMsg.getId(), assistantMsg.getRole(), assistantMsg.getContent(), assistantMsg.getCreatedAt(), assistantMsg.getMetadataJson())
        );
    }

    private ChatResponse toChatDto(Chat chat) {
        Model model = chat.getModel();
        Provider provider = model == null ? null : model.getProvider();
        return new ChatResponse(
                chat.getId(),
                model == null ? null : model.getId(),
                model == null ? null : model.getName(),
                provider == null ? null : provider.getName(),
                provider == null ? null : provider.getLogoUrl(),
                chat.getTitle(),
                chat.getCreatedAt()
        );
    }

    /**
     * Phase 1 "context": use recent messages and concatenate into a single prompt string.
     * This keeps adapters simple while still giving the LLM conversational memory.
     */
    private String buildConversationPrompt(Chat chat, String configJson) {
        // Read last N messages (including the user message we just saved)
        int maxMessages = 30;
        Integer ctxLimit = parseIntField(configJson, "contextLength");
        // Keep a safety margin for the model to produce output.
        int tokenBudget = (ctxLimit != null && ctxLimit > 0) ? Math.max(256, ctxLimit - 512) : 8000;

        var raw = msgRepo.findAllByChat(chat, PageRequest.of(0, 60, Sort.by("createdAt").descending())).getContent();
        if (raw == null || raw.isEmpty()) return "";
        // Page.getContent() may be unmodifiable; copy before reversing.
        List<ChatMessage> page = new ArrayList<>(raw);
        Collections.reverse(page); // oldest -> newest

        // Build from the end backwards until we fit budget, then reverse again.
        List<ChatMessage> picked = new ArrayList<>();
        int used = 0;
        for (int i = page.size() - 1; i >= 0 && picked.size() < maxMessages; i--) {
            ChatMessage m = page.get(i);
            // Truncate very large messages so we always preserve some multi-turn history.
            String content = truncateForPrompt(m.getContent(), 1200); // ~1200 tokens (~4800 chars)
            String line = rolePrefix(m.getRole()) + content;
            int est = estimateTokens(line) + 4; // small separator cost
            if (!picked.isEmpty() && (used + est) > tokenBudget) break;
            picked.add(m);
            used += est;
        }
        Collections.reverse(picked);

        StringBuilder sb = new StringBuilder();
        sb.append("You are a helpful AI assistant.\n\n");
        sb.append("Conversation so far:\n");
        for (ChatMessage m : picked) {
            sb.append(rolePrefix(m.getRole())).append(truncateForPrompt(m.getContent(), 1200)).append("\n");
        }
        sb.append("Assistant:");
        return sb.toString();
    }

    private String rolePrefix(String role) {
        if (role == null) return "User: ";
        String r = role.trim().toLowerCase();
        if (r.equals("assistant")) return "Assistant: ";
        if (r.equals("system")) return "System: ";
        return "User: ";
    }

    private int estimateTokens(String s) {
        if (s == null || s.isBlank()) return 0;
        int chars = s.trim().length();
        return Math.max(1, (int) Math.ceil(chars / 4.0));
    }

    private String truncateForPrompt(String s, int maxTokensApprox) {
        if (s == null) return "";
        String t = s.trim();
        if (t.isEmpty()) return "";
        int maxChars = Math.max(200, maxTokensApprox * 4);
        if (t.length() <= maxChars) return t;
        return t.substring(0, maxChars) + "\n...[truncated]\n";
    }

    private String generateChatTitle(
            String providerType,
            String providerName,
            String baseUrl,
            String apiKey,
            Model model,
            String firstUserMessage
    ) {
        if (model == null) return null;
        if (firstUserMessage == null || firstUserMessage.isBlank()) return null;

        String seed = firstUserMessage.trim().replaceAll("\\s+", " ");
        if (seed.length() > 500) seed = seed.substring(0, 500);

        String titlePrompt =
                "Generate a short chat title (max 6 words) that summarizes the user's request.\n" +
                "Return ONLY the title, no quotes, no markdown.\n\n" +
                "User message:\n" + seed;

        // Force a tiny generation so this doesn't add latency/cost.
        String titleConfigJson = "{\"maxOutputTokens\":32}";

        var titleRes = llmRouter.generate(new LlmRequest(
                model.getId(),
                model.getName(),
                model.getModelKey(),
                providerType,
                providerName,
                baseUrl,
                apiKey,
                titlePrompt,
                titleConfigJson
        ));

        String raw = titleRes == null ? null : titleRes.content();
        if (raw == null) return null;
        String t = raw.trim();
        // take first line only
        int nl = t.indexOf('\n');
        if (nl >= 0) t = t.substring(0, nl).trim();
        // strip surrounding quotes
        t = t.replaceAll("^\"+|\"+$", "").trim();
        // remove trailing punctuation noise
        t = t.replaceAll("^[\\-*#\\s]+", "").trim();
        if (t.length() > 60) t = t.substring(0, 60).trim();
        if (t.isBlank()) return null;
        return t;
    }

    private Integer parseIntField(String json, String field) {
        if (json == null || json.isBlank()) return null;
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode n = root.get(field);
            if (n == null || n.isNull()) return null;
            if (n.isInt()) return n.intValue();
            if (n.isLong()) return (int) n.longValue();
            if (n.isTextual()) {
                String s = n.asText("").trim();
                if (s.isBlank()) return null;
                String digits = s.replaceAll("[^0-9]", "");
                if (digits.isBlank()) return null;
                return Integer.parseInt(digits);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}

