-- Flyway V6: Backfill providers.base_url from models.endpoint_url (Phase-1 data cleanup)
-- Rationale: base URL is typically a provider-level concern (host + API version),
-- while model stores model_key + capabilities/config.

-- If provider.base_url is missing, take any non-null model.endpoint_url for that provider.
UPDATE providers p
SET base_url = m.endpoint_url
FROM (
  SELECT provider_id, MIN(endpoint_url) AS endpoint_url
  FROM models
  WHERE endpoint_url IS NOT NULL AND endpoint_url <> ''
  GROUP BY provider_id
) m
WHERE p.id = m.provider_id
  AND (p.base_url IS NULL OR p.base_url = '');

-- Optional cleanup: if model.endpoint_url equals provider.base_url, null it out
-- so endpoint_url can be reserved for per-model overrides.
UPDATE models mo
SET endpoint_url = NULL
FROM providers p
WHERE mo.provider_id = p.id
  AND mo.endpoint_url IS NOT NULL
  AND p.base_url IS NOT NULL
  AND mo.endpoint_url = p.base_url;

