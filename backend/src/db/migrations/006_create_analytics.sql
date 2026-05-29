CREATE TABLE analytics (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type    TEXT NOT NULL,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  stream_id     UUID REFERENCES streams(id) ON DELETE SET NULL,
  mirror_id     UUID REFERENCES mirrors(id) ON DELETE SET NULL,
  session_id    TEXT,
  isp           TEXT,
  quality       TEXT,
  buffering_ms  INTEGER DEFAULT 0,
  duration_ms   INTEGER DEFAULT 0,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_event ON analytics(event_type, created_at DESC);
CREATE INDEX idx_analytics_stream ON analytics(stream_id, created_at DESC);
