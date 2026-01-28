# APEX Platform API (Phase 1 - Spring Boot + PostgreSQL)

This backend turns the current frontend-only prototype into a **real API** with:
- **JWT Authentication** (register/login/me)
- **PostgreSQL persistence** (Flyway migrations)
- **CRUD APIs** for **Providers**, **Models**, and **Data Sources**

## Prerequisites
- Java **17+**
- PostgreSQL **14+**

## 1) Start PostgreSQL (recommended via Docker)
From repo root:

```bash
docker compose -f infra/docker-compose.yml up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

## 2) Configure environment
Create `backend/src/main/resources/application-dev.yml` overrides if needed, or set env vars:

- `SPRING_DATASOURCE_URL` (default: `jdbc:postgresql://localhost:5432/apex`)
- `SPRING_DATASOURCE_USERNAME` (default: `apex`)
- `SPRING_DATASOURCE_PASSWORD` (default: `apex`)
- `APP_JWT_SECRET` (default: `dev-secret-change-me`)
- `APP_DEFAULT_TENANT_NAME` (default: `Default Tenant`)
- `APP_ADMIN_EMAIL` (default: `admin@apex.local`)
- `APP_ADMIN_PASSWORD` (default: `admin123!`)

## 3) Run the API
From repo root:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

API starts at: `http://localhost:8081`

Swagger UI:
- `http://localhost:8081/swagger-ui/index.html`

## Troubleshooting
### Postgres: `invalid value for parameter "TimeZone": "Asia/Calcutta"`
PostgreSQL 16 rejects the legacy zone name `Asia/Calcutta`. Use **`Asia/Kolkata`** (or **`UTC`**) instead.

Common cause is a custom JDBC URL like:
- `jdbc:postgresql://localhost:5432/apex?options=-c%20TimeZone%3DAsia%2FCalcutta`

Fix by updating/unsetting `SPRING_DATASOURCE_URL` to remove that `options` param, or replace it with:
- `...options=-c%20TimeZone%3DAsia%2FKolkata`

## 4) Quick test (Auth)
Register:

```bash
curl -X POST http://localhost:8081/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user@apex.local\",\"password\":\"Password123!\"}"
```

Login:

```bash
curl -X POST http://localhost:8081/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@apex.local\",\"password\":\"admin123!\"}"
```

Then call:

```bash
curl http://localhost:8081/me -H "Authorization: Bearer <JWT>"
```

