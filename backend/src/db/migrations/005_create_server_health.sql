CREATE TABLE server_health (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mirror_id     UUID NOT NULL REFERENCES mirrors(id) ON DELETE CASCADE,
  latency_ms    INTEGER,
  is_reachable  BOOLEAN NOT NULL,
  checked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_server_health_mirror ON server_health(mirror_id, checked_at DESC);
