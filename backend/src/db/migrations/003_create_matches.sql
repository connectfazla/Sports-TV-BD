CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'finished', 'postponed', 'cancelled');

CREATE TABLE matches (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  home_team     TEXT NOT NULL,
  away_team     TEXT NOT NULL,
  home_logo     TEXT,
  away_logo     TEXT,
  tournament    TEXT,
  venue         TEXT,
  stream_id     UUID REFERENCES streams(id) ON DELETE SET NULL,
  status        match_status NOT NULL DEFAULT 'scheduled',
  scheduled_at  TIMESTAMPTZ NOT NULL,
  started_at    TIMESTAMPTZ,
  ended_at      TIMESTAMPTZ,
  home_score    SMALLINT DEFAULT 0,
  away_score    SMALLINT DEFAULT 0,
  stats         JSONB DEFAULT '{}',
  standings     JSONB DEFAULT '{}',
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_scheduled_at ON matches(scheduled_at);
