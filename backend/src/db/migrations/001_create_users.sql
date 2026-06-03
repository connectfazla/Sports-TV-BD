CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('user', 'premium', 'admin', 'superadmin');

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id     TEXT UNIQUE NOT NULL,
  fcm_token     TEXT,
  role          user_role NOT NULL DEFAULT 'user',
  is_banned     BOOLEAN NOT NULL DEFAULT false,
  country_code  TEXT DEFAULT 'BD',
  isp           TEXT,
  app_version   TEXT,
  last_seen_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_device_id ON users(device_id);
CREATE INDEX idx_users_role ON users(role);
