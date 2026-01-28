-- Flyway V2: Audit logs (minimal, Phase 1+)

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  actor_email text,
  action text NOT NULL,          -- e.g., AUTH_LOGIN, PROVIDER_CREATE, MODEL_DELETE
  entity_type text,              -- e.g., provider, model, data_source
  entity_id uuid,
  method text,
  path text,
  ip text,
  user_agent text,
  success boolean NOT NULL DEFAULT true,
  details_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

