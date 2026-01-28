-- Flyway V4: Provider secrets (encrypted at rest)

ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS type text,
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS base_url text,
  ADD COLUMN IF NOT EXISTS metadata_json jsonb;

CREATE TABLE IF NOT EXISTS provider_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL UNIQUE REFERENCES providers(id) ON DELETE CASCADE,
  encrypted_secret text NOT NULL,
  key_version int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_provider_secrets_provider_id ON provider_secrets(provider_id);

