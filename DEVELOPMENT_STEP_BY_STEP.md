# APEX Platform — Step-by-Step Development Plan (Prototype → Production)

This document converts the current **frontend-only prototype** into an actionable, step-by-step build plan for a **fully functional product**: backend, database, auth, LLM provider integrations, workflows, multi-tenancy, and deployment.

---

## Guiding Decisions (make these first)

- **Backend**: Spring Boot 3 (Java/Kotlin) recommended (enterprise security, modularity, observability).
- **DB**: PostgreSQL (primary relational store).
- **Cache**: Redis (caching, rate limits, idempotency keys, short-lived state).
- **Async + Events**: Kafka (workflow execution, training jobs, audit/usage streams).
- **Storage**: S3-compatible (AWS S3 / MinIO) for uploads (datasets, documents).
- **Vector DB** (later): Qdrant/Weaviate/Pinecone for embeddings & RAG.
- **Frontend**: Keep React app initially; add a clean API layer + React Query.

If you choose a different backend (FastAPI/Django), the steps still apply—only implementation details change.

---

## Target Architecture (end state)

- **Web App**: React UI
- **API**: Spring Boot REST API (+ SSE/WebSocket for real-time progress/streaming)
- **DB**: PostgreSQL + migrations
- **Jobs/Events**: Kafka topics + consumer groups for long-running work and eventing
- **Observability**: structured logs + metrics + tracing hooks
- **Deploy**: containerized, CI/CD, environment-based configs

---

## Step 0 — Repo Restructure (monorepo) + Local Dev (Day 1–2)

### Goal
Create a clean workspace that supports frontend + backend + infra.

### Deliverables
- `apps/web` (existing React frontend moved here)
- `apps/api` (new Spring Boot backend)
- `infra/` (docker-compose, local dependencies)
- root `.gitignore` cleaned (don’t commit secrets, don’t commit `node_modules`)

### “Done” criteria
- `npm run dev` starts both web + api locally (or two commands documented).
- Docker Compose starts Postgres + Redis + Kafka (+ MinIO optional).

---

## Step 1 — Backend Skeleton + API Conventions (Week 1)

### Goal
Bootstrap the backend with standard production conventions.

### Build
- Spring Boot 3 project in `apps/api` (Gradle or Maven)
- Config management:
  - `.env` for local dev (optional) + Spring profiles `dev|staging|prod`
  - `application.yml` + `application-dev.yml`
- Request validation:
  - Jakarta Bean Validation (`@Valid`, `@NotNull`, etc.)
- Error handling:
  - `@ControllerAdvice` → consistent error response
- OpenAPI/Swagger:
  - springdoc-openapi → `/swagger-ui` and `/v3/api-docs`
- Streaming support (needed for chat/workflow progress):
  - Prefer **SSE** and/or **WebSocket**
  - Consider Spring WebFlux for streaming endpoints if you want backpressure-friendly streaming

### “Done” criteria
- `GET /health` returns `{ status: "ok" }`
- Swagger shows at least 1 endpoint
- Lint/build passes

---

## Step 2 — Database + ORM + Migrations (Week 1–2)

### Goal
Introduce persistence and a stable schema workflow.

### Recommended
- **Spring Data JPA (Hibernate)** + **Flyway** (or Liquibase) for migrations.

### Initial schema (minimum)
- `users`
- `tenants` (organizations)
- `memberships` (user↔tenant, role)
- `api_keys` (for programmatic access, later)

### “Done” criteria
- `./gradlew flywayMigrate` (or app-start auto-migrate in dev) creates tables in Postgres
- `GET /health/db` confirms DB connectivity
- Local dev DB is reproducible via Docker Compose

---

## Step 3 — Authentication + Authorization (Week 2)

### Goal
Secure the platform and enable enterprise roles.

### Build
- Auth (enterprise):
  - **OIDC/SSO** (Azure AD / Okta / Keycloak) using Spring Security
  - Backend as **OAuth2 Resource Server** validating JWTs
  - Recommended pattern: **BFF** (Backend-for-Frontend) using Spring Security OAuth2 Client + server-side session cookies (avoids storing tokens in the browser)
- RBAC:
  - Roles: `owner`, `admin`, `developer`, `viewer`
  - Tenant-scoped permissions
- Audit trail (minimal):
  - log auth events (login, logout, refresh)

### APIs
- If using pure Resource Server (SPA holds tokens):
  - No login endpoints; auth is handled by IdP redirects (Authorization Code + PKCE)
- If using BFF:
  - `/oauth2/authorization/{registrationId}` (start login)
  - `/login/oauth2/code/{registrationId}` (callback)
- `GET /me`

### “Done” criteria
- Protected routes reject unauthenticated requests
- Tenant role checks enforced in at least one endpoint

---

## Step 4 — Tenant Onboarding (Week 2–3)

### Goal
Make the “AIOS onboarding wizard” real: create tenant + initial settings.

### Build
- Tenant creation workflow:
  - Create tenant
  - Create owner membership
  - Store onboarding selections (industry, use case, preferences)

### APIs
- `POST /tenants`
- `GET /tenants`
- `GET /tenants/:id`
- `PUT /tenants/:id`

### “Done” criteria
- User can create tenant, then see it in UI after refresh (persisted)

---

## Step 5 — Provider Registry + Secrets Handling (Week 3)

### Goal
Turn “Providers” UI into real provider configurations (OpenAI, Anthropic, etc.).

### Build
- `providers` table:
  - name, type, status, baseUrl, metadata
- Credentials:
  - store encrypted at rest (KMS in prod; local dev can use app key)
  - NEVER expose full secrets to frontend

### APIs
- `GET /providers`
- `POST /providers`
- `PUT /providers/:id`
- `DELETE /providers/:id`
- `POST /providers/:id/test` (validate key by calling provider)

### “Done” criteria
- Provider can be created and “tested” successfully
- Secrets are masked in all responses/logs

---

## Step 6 — Model Catalog (Week 3–4)

### Goal
Persist models (and map them to providers) so the catalog is real.

### Build
- `models` table:
  - providerId, name, modelKey, type (api/self-hosted), pricing hints, status
- Add server-side filtering/pagination

### APIs
- `GET /models?providerId=&type=&q=&page=&pageSize=`
- `POST /models`
- `GET /models/:id`
- `PUT /models/:id`
- `DELETE /models/:id`

### “Done” criteria
- UI “Model Catalog” loads from backend
- Add/edit/delete updates persist

---

## Step 7 — Playground (Chat + Streaming) (Week 4–5)

### Goal
Make the playground actually call providers through your backend.

### Build
- Unified provider adapter interface:
  - `generate()` (non-stream)
  - `stream()` (SSE/WebSocket)
- Persist conversations:
  - `chats`, `messages` tables

### APIs
- `POST /chat` (create chat)
- `POST /chat/:id/messages` (send message, get response)
- `GET /chat/:id`
- `GET /chat/:id/messages`
- `GET /chat/:id/stream` (SSE) or `WS /ws/chat/:id`

### “Done” criteria
- User can chat with a real provider from the UI
- Streaming responses work

---

## Step 8 — Data Sources (Week 5–6)

### Goal
Make data source connections real (DB/API/Webhook) with secure storage.

### Build
- `data_sources` table:
  - type: `postgres`, `mysql`, `rest_api`, `webhook`, etc.
  - connection config encrypted
- Test & sync:
  - `test connection`
  - schedule sync (later)

### APIs
- `GET /data-sources`
- `POST /data-sources`
- `PUT /data-sources/:id`
- `DELETE /data-sources/:id`
- `POST /data-sources/:id/test`

### “Done” criteria
- “Test connection” works for at least one connector type (e.g., Postgres)

---

## Step 9 — Workflow Builder → Workflow Engine (Week 6–8)

### Goal
Convert visual workflows into executable backend workflows.

### Build
- Persist workflow definition (JSON) + versioning:
  - `workflows`, `workflow_versions`
- Execution engine:
  - node types: `LLM_CALL`, `HTTP_REQUEST`, `TRANSFORM`, `CONDITION`
  - retries, timeouts, step logging
- Execution history:
  - `workflow_runs`, `workflow_run_steps`
- Async execution via Kafka:
  - `workflow.run.requested` topic (producer: API)
  - `workflow.run.step` topic (producer: workers/executors)
  - `workflow.run.completed` topic (producer: workers/executors)
  - Consumers update Postgres `workflow_runs` + `workflow_run_steps`
  - stream status updates via WS/SSE (API reads from DB and/or subscribes to Kafka)

### APIs
- `POST /workflows`
- `GET /workflows`
- `GET /workflows/:id`
- `PUT /workflows/:id`
- `POST /workflows/:id/run`
- `GET /workflow-runs/:runId`
- `GET /workflow-runs/:runId/stream`

### “Done” criteria
- Create workflow in UI, run it, see status + output

---

## Step 10 — Rules Engine (Week 8–9)

### Goal
Persist and enforce business rules (rate limits, policies, guardrails).

### Build
- `rules` table with tenant scope
- Rule evaluation hooks:
  - before provider call
  - before workflow run
  - before data source access

### “Done” criteria
- A rule can block/allow an action deterministically (auditable)

---

## Step 11 — Training / Fine-Tuning Jobs (Week 9–11)

### Goal
Turn “training” screens into real asynchronous jobs.

### Build
- File upload → store in S3/MinIO
- Kafka-driven jobs for preprocessing/training
- Track status:
  - `training_jobs`, `training_datasets`
- Provider-specific fine-tuning support (where available)

### “Done” criteria
- Upload dataset, create training job, see progress + completion state

---

## Step 12 — Usage, Billing, Reporting (Week 11–12)

### Goal
Measure usage/cost and produce tenant dashboards.

### Build
- Usage events:
  - tokens, latency, provider, model, tenant, user
- Aggregations:
  - daily rollups
- Billing:
  - configurable pricing + invoice export

### “Done” criteria
- Utilization report in UI is backed by DB queries (not mock)

---

## Step 13 — Production Hardening (Week 12–14)

### Goal
Make it safe, observable, and resilient.

### Build
- Rate limiting & abuse protection
- Input validation everywhere
- Secrets management (KMS/Vault in prod)
- Structured logging with request IDs
- Health checks:
  - `/health`, `/health/db`, `/health/redis`
- Error monitoring (Sentry) and metrics (Prometheus)

### “Done” criteria
- Load test passes basic concurrency targets
- No secrets logged; security headers configured

---

## Step 14 — Deployment + CI/CD (Week 14–16)

### Goal
Repeatable deployments with environment separation.

### Build
- Docker:
  - `apps/web` Dockerfile
  - `apps/api` Dockerfile
- CI:
  - lint, test, build
  - push images
- Deploy:
  - MVP: single VM + Docker Compose
  - Scale: Kubernetes (Ingress + autoscaling)

### “Done” criteria
- One-command deployment to staging
- Rollback strategy documented

---

## Frontend Implementation Approach (incremental, keeps UI stable)

For each domain (providers, models, workflows, etc.):
- Replace mock `useState([...])` with **API-backed state**
- Add a thin API client:
  - `src/api/httpClient.js` (base URL, auth header, error mapping)
  - `src/api/*.js` per feature
- Use **React Query** for caching + loading/error states
- Add login flow and persist tokens securely (httpOnly cookies preferred)

---

## Definition of “MVP” (recommended scope)

MVP should include:
- Auth + tenants + RBAC
- Providers + Models
- Playground (real provider calls)
- Workflows (create/run/history)
- Basic usage logging
- Docker-based deployment (staging)

Everything else (training, billing, advanced semantic layer) can follow.

