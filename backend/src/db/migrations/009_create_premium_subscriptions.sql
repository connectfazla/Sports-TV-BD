CREATE TYPE sub_status AS ENUM ('active', 'expired', 'cancelled', 'trial');

CREATE TABLE premium_subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          sub_status NOT NULL DEFAULT 'trial',
  plan_type       TEXT NOT NULL DEFAULT 'monthly',
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  payment_ref     TEXT,
  payment_gateway TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subs_user ON premium_subscriptions(user_id, status);
CREATE INDEX idx_subs_expiry ON premium_subscriptions(expires_at) WHERE status = 'active';
