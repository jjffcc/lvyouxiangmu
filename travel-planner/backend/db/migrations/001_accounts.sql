CREATE TABLE accounts (
  id uuid PRIMARY KEY,
  identifier text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
