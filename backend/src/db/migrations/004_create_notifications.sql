CREATE TYPE notif_type AS ENUM ('match_start', 'match_end', 'maintenance', 'promo', 'general', 'force_update');

CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  type          notif_type NOT NULL DEFAULT 'general',
  image_url     TEXT,
  deep_link     TEXT,
  target_roles  user_role[] DEFAULT ARRAY['user','premium']::user_role[],
  sent_count    INTEGER DEFAULT 0,
  sent_at       TIMESTAMPTZ,
  scheduled_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
