-- Standalone SQL equivalent of Flyway V6__backfill_provider_base_url.sql

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

UPDATE models mo
SET endpoint_url = NULL
FROM providers p
WHERE mo.provider_id = p.id
  AND mo.endpoint_url IS NOT NULL
  AND p.base_url IS NOT NULL
  AND mo.endpoint_url = p.base_url;

