# Spring Boot Backend Blueprint (APEX Platform)

This is a concrete starting blueprint for implementing the backend as **Spring Boot** with **OIDC SSO** and **Kafka-based workflow execution**.

---

## Recommended stack (opinionated)

- **Spring Boot**: 3.x
- **Language**: Java 21 (or Java 17) / Kotlin optional
- **API**: Spring MVC for standard REST, add **Spring WebFlux** only if you want heavy streaming
- **Auth**: Spring Security + OIDC (Azure AD / Okta / Keycloak)
- **DB**: PostgreSQL + Spring Data JPA (Hibernate)
- **Migrations**: Flyway
- **Messaging**: Kafka (Spring for Apache Kafka)
- **Cache/Rate limits**: Redis
- **Docs**: springdoc-openapi
- **Observability**: Micrometer + OpenTelemetry (later)

---

## Recommended auth pattern: BFF (best security for SPA)

### Why
- Avoids storing access tokens in browser storage.
- Backend owns tokens and calls providers safely.

### How
- Spring Boot acts as **OAuth2 Client** to IdP.
- After login, backend sets an **httpOnly session cookie**.
- React app calls backend with cookie; backend uses the authenticated session.

If you prefer SPA PKCE (frontend holds tokens), it’s workable, but BFF is safer for enterprise.

---

## Module structure (package layout)

Use domain modules so the codebase remains scalable:

- `com.apexplatform.api`
  - `common` (errors, pagination, logging, request-id)
  - `security` (OIDC config, RBAC, tenant context, filters)
  - `tenants`
  - `users`
  - `providers` (provider registry + encrypted secrets)
  - `models` (model catalog)
  - `chat` (playground + streaming)
  - `datasources` (connectors + tests)
  - `workflows` (definitions + engine)
  - `workflowruns` (execution state + streaming status)
  - `rules` (policies/guardrails)
  - `usage` (metering/events)
  - `billing` (later)

---

## Kafka topic design (minimum)

- **Workflow**
  - `workflow.run.requested`
  - `workflow.run.step`
  - `workflow.run.completed`
  - `workflow.run.failed`

- **Training**
  - `training.job.requested`
  - `training.job.progress`
  - `training.job.completed`
  - `training.job.failed`

- **Usage/Audit**
  - `usage.event`
  - `audit.event`

### Pattern
- API produces “requested”.
- Worker/executor consumes, runs steps, produces “step/progress/completed”.
- A consumer persists events to Postgres for querying from the UI.

---

## Core database tables (start small, expand)

- `tenants(id, name, industry, use_case, created_at, ...)`
- `users(id, email, display_name, external_subject, created_at, ...)`
- `memberships(id, tenant_id, user_id, role, created_at, ...)`
- `providers(id, tenant_id, name, type, base_url, status, created_at, ...)`
- `provider_secrets(id, provider_id, encrypted_secret, key_version, created_at, ...)`
- `models(id, tenant_id, provider_id, name, model_key, type, status, pricing_json, ...)`
- `chats(id, tenant_id, created_by, created_at, ...)`
- `chat_messages(id, chat_id, role, content, created_at, ...)`
- `workflows(id, tenant_id, name, status, created_at, ...)`
- `workflow_versions(id, workflow_id, version, definition_json, created_at, ...)`
- `workflow_runs(id, workflow_version_id, status, started_at, finished_at, ...)`
- `workflow_run_steps(id, workflow_run_id, step_key, status, input_json, output_json, ...)`

---

## API surface (MVP)

- **Auth**
  - `GET /me`
- **Tenants**
  - `POST /tenants`
  - `GET /tenants`
  - `GET /tenants/{id}`
- **Providers**
  - `GET /providers`
  - `POST /providers`
  - `POST /providers/{id}/test`
- **Models**
  - `GET /models`
  - `POST /models`
- **Chat**
  - `POST /chat`
  - `POST /chat/{id}/messages`
  - `GET /chat/{id}/stream` (SSE) or `WS /ws/chat/{id}`
- **Workflows**
  - `POST /workflows`
  - `POST /workflows/{id}/run`
  - `GET /workflow-runs/{runId}`
  - `GET /workflow-runs/{runId}/stream`

---

## Streaming recommendation (chat + workflow progress)

- **SSE** is usually simplest for browser clients.
- For LLM token streaming: consider **WebFlux** endpoints if you want robust streaming/backpressure.
- For workflow progress: DB polling + SSE is acceptable for MVP; later you can bridge Kafka → SSE.

---

## “First implementation slice” (what to build first)

1. Spring Boot app + `/health` + Swagger
2. OIDC login (BFF or Resource Server) + `GET /me`
3. Postgres + Flyway + `tenants/users/memberships`
4. Providers CRUD + encrypted secrets storage
5. Models CRUD

