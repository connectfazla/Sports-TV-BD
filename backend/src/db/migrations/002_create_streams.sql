CREATE TYPE stream_status AS ENUM ('active', 'inactive', 'maintenance');
CREATE TYPE stream_category AS ENUM ('sports', 'cricket', 'football', 'tennis', 'bdix', 'international', 'fifa');

CREATE TABLE streams (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  logo_url      TEXT,
  category      stream_category NOT NULL DEFAULT 'sports',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  status        stream_status NOT NULL DEFAULT 'active',
  is_premium    BOOLEAN NOT NULL DEFAULT false,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE mirrors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id     UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  url_encrypted TEXT NOT NULL,
  url_iv        TEXT NOT NULL,
  url_tag       TEXT NOT NULL,
  label         TEXT NOT NULL DEFAULT 'Primary',
  server_region TEXT NOT NULL DEFAULT 'bd',
  is_bdix       BOOLEAN NOT NULL DEFAULT false,
  priority      INTEGER NOT NULL DEFAULT 1,
  is_enabled    BOOLEAN NOT NULL DEFAULT true,
  health_score  SMALLINT DEFAULT 100,
  last_checked  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mirrors_stream_id ON mirrors(stream_id);
CREATE INDEX idx_mirrors_priority ON mirrors(stream_id, priority, is_enabled);
