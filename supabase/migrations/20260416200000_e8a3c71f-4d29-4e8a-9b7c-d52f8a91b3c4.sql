-- Encrypt Google Calendar OAuth tokens at rest.
-- Reuses vault-backed encrypt_sensitive_data / decrypt_sensitive_data
-- helpers (see 20251208173619). All token reads/writes move to
-- SECURITY DEFINER RPCs granted only to service_role, so direct plaintext
-- access is no longer possible even via PostgREST.

-- 1. Add encrypted columns
ALTER TABLE public.google_calendar_tokens
  ADD COLUMN IF NOT EXISTS access_token_encrypted bytea,
  ADD COLUMN IF NOT EXISTS refresh_token_encrypted bytea;

-- 2. Drop NOT NULL from plaintext columns (they will be nulled out)
ALTER TABLE public.google_calendar_tokens
  ALTER COLUMN access_token DROP NOT NULL,
  ALTER COLUMN refresh_token DROP NOT NULL;

-- 3. One-time migration of existing plaintext tokens to encrypted form
UPDATE public.google_calendar_tokens
SET
  access_token_encrypted = public.encrypt_sensitive_data(access_token),
  refresh_token_encrypted = public.encrypt_sensitive_data(refresh_token),
  access_token = NULL,
  refresh_token = NULL
WHERE (access_token IS NOT NULL OR refresh_token IS NOT NULL)
  AND access_token_encrypted IS NULL;

-- 4. BEFORE trigger so any future plaintext write is auto-encrypted,
--    protecting against stale client code that may still target the
--    plaintext columns directly.
CREATE OR REPLACE FUNCTION public.encrypt_google_calendar_tokens_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.access_token IS NOT NULL AND NEW.access_token <> '' THEN
    NEW.access_token_encrypted := public.encrypt_sensitive_data(NEW.access_token);
    NEW.access_token := NULL;
  END IF;
  IF NEW.refresh_token IS NOT NULL AND NEW.refresh_token <> '' THEN
    NEW.refresh_token_encrypted := public.encrypt_sensitive_data(NEW.refresh_token);
    NEW.refresh_token := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS encrypt_google_calendar_tokens ON public.google_calendar_tokens;
CREATE TRIGGER encrypt_google_calendar_tokens
  BEFORE INSERT OR UPDATE OF access_token, refresh_token
  ON public.google_calendar_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_google_calendar_tokens_trigger();

-- 5. Lock down direct column access for non-service roles.
--    service_role bypasses and keeps full access for edge functions.
REVOKE SELECT (access_token, refresh_token,
               access_token_encrypted, refresh_token_encrypted)
  ON public.google_calendar_tokens FROM anon, authenticated;

-- 6. RPC: Upsert tokens (encrypts on write)
CREATE OR REPLACE FUNCTION public.upsert_google_calendar_tokens(
  p_user_id uuid,
  p_access_token text,
  p_refresh_token text,
  p_token_expiry timestamptz,
  p_calendar_id text DEFAULT 'primary'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id is required';
  END IF;
  IF p_access_token IS NULL OR p_access_token = '' THEN
    RAISE EXCEPTION 'access_token is required';
  END IF;
  IF p_refresh_token IS NULL OR p_refresh_token = '' THEN
    RAISE EXCEPTION 'refresh_token is required';
  END IF;

  INSERT INTO public.google_calendar_tokens (
    user_id,
    access_token_encrypted,
    refresh_token_encrypted,
    token_expiry,
    calendar_id,
    updated_at
  )
  VALUES (
    p_user_id,
    public.encrypt_sensitive_data(p_access_token),
    public.encrypt_sensitive_data(p_refresh_token),
    p_token_expiry,
    COALESCE(p_calendar_id, 'primary'),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    access_token_encrypted = EXCLUDED.access_token_encrypted,
    refresh_token_encrypted = EXCLUDED.refresh_token_encrypted,
    token_expiry = EXCLUDED.token_expiry,
    calendar_id = EXCLUDED.calendar_id,
    updated_at = now(),
    access_token = NULL,
    refresh_token = NULL
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- 7. RPC: Fetch (and decrypt) tokens for a user
CREATE OR REPLACE FUNCTION public.get_google_calendar_tokens(p_user_id uuid)
RETURNS TABLE (
  access_token text,
  refresh_token text,
  token_expiry timestamptz,
  calendar_id text,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id is required';
  END IF;

  RETURN QUERY
  SELECT
    public.decrypt_sensitive_data(t.access_token_encrypted) AS access_token,
    public.decrypt_sensitive_data(t.refresh_token_encrypted) AS refresh_token,
    t.token_expiry,
    t.calendar_id,
    t.updated_at
  FROM public.google_calendar_tokens t
  WHERE t.user_id = p_user_id
  LIMIT 1;
END;
$$;

-- 8. RPC: Rotate access_token after a refresh_token exchange
CREATE OR REPLACE FUNCTION public.update_google_calendar_access_token(
  p_user_id uuid,
  p_access_token text,
  p_token_expiry timestamptz
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL OR p_access_token IS NULL OR p_access_token = '' THEN
    RAISE EXCEPTION 'user_id and access_token are required';
  END IF;

  UPDATE public.google_calendar_tokens
  SET
    access_token_encrypted = public.encrypt_sensitive_data(p_access_token),
    token_expiry = p_token_expiry,
    updated_at = now(),
    access_token = NULL
  WHERE user_id = p_user_id;

  RETURN FOUND;
END;
$$;

-- 9. RPC: Existence / metadata check (no decryption)
CREATE OR REPLACE FUNCTION public.google_calendar_tokens_exists(p_user_id uuid)
RETURNS TABLE (
  exists_ boolean,
  calendar_id text,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT true, t.calendar_id, t.updated_at
  FROM public.google_calendar_tokens t
  WHERE t.user_id = p_user_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::text, NULL::timestamptz;
  END IF;
END;
$$;

-- 10. RPC: Disconnect / delete tokens
CREATE OR REPLACE FUNCTION public.delete_google_calendar_tokens(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.google_calendar_tokens WHERE user_id = p_user_id;
  RETURN FOUND;
END;
$$;

-- 11. Lock down RPC execution to service_role only.
--     Edge functions use the service_role key; browser/admin clients
--     cannot call these directly, preventing cross-user token lookup.
REVOKE EXECUTE ON FUNCTION public.upsert_google_calendar_tokens(uuid, text, text, timestamptz, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_google_calendar_tokens(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_google_calendar_access_token(uuid, text, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.google_calendar_tokens_exists(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_google_calendar_tokens(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.upsert_google_calendar_tokens(uuid, text, text, timestamptz, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_google_calendar_tokens(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_google_calendar_access_token(uuid, text, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.google_calendar_tokens_exists(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_google_calendar_tokens(uuid) TO service_role;
