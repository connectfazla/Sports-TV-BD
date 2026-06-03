CREATE TABLE app_config (
  key           TEXT PRIMARY KEY,
  value         JSONB NOT NULL,
  description   TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO app_config (key, value, description) VALUES
  ('min_app_version',       '"1.0.0"',         'Force update below this version'),
  ('latest_app_version',    '"1.0.0"',         'Latest available version'),
  ('latest_apk_url',        '""',              'Direct APK download URL'),
  ('maintenance_mode',      'false',            'Show maintenance screen globally'),
  ('maintenance_message',   '"We will be back shortly"', 'Maintenance screen message'),
  ('feature_flags',         '{"chat":true,"standings":true,"stats":true,"rewarded_hd":true,"pip":false}', 'Feature toggles'),
  ('server_check_interval', '30',              'Mirror health check interval seconds'),
  ('stream_token_ttl',      '3600',            'Stream signed URL TTL seconds'),
  ('bdix_preference',       'true',            'Prefer BDIX servers for BD users'),
  ('force_popup',           'null',            'Force popup JSON config or null'),
  ('changelog',             '{"1.0.0":"Initial release"}', 'Version changelogs');
