CREATE TABLE ad_config (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider        TEXT NOT NULL DEFAULT 'admob',
  ad_type         TEXT NOT NULL,
  ad_unit_id      TEXT NOT NULL,
  is_enabled      BOOLEAN NOT NULL DEFAULT true,
  frequency_cap   INTEGER DEFAULT 0,
  cooldown_sec    INTEGER DEFAULT 900,
  geo_rules       JSONB DEFAULT '{}',
  fallback_config JSONB DEFAULT '{}',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO ad_config (provider, ad_type, ad_unit_id, frequency_cap, cooldown_sec) VALUES
  ('admob',    'banner',        'ca-app-pub-3940256099942544/6300978111', 0,    0),
  ('admob',    'interstitial',  'ca-app-pub-3940256099942544/1033173712', 1,    900),
  ('admob',    'rewarded',      'ca-app-pub-3940256099942544/5224354917', 0,    0),
  ('admob',    'native',        'ca-app-pub-3940256099942544/2247696110', 0,    0),
  ('applovin', 'interstitial',  'YOUR_APPLOVIN_INTERSTITIAL_ID',          1,    900),
  ('applovin', 'rewarded',      'YOUR_APPLOVIN_REWARDED_ID',              0,    0);
