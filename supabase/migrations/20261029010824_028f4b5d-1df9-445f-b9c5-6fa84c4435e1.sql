CREATE TABLE public.human_ai_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 owner_hash text NOT NULL,
 state jsonb NOT NULL,
 version integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.human_ai_sessions TO service_role;
REVOKE ALL ON public.human_ai_sessions FROM anon, authenticated;
ALTER TABLE public.human_ai_sessions ENABLE ROW LEVEL SECURITY;
CREATE INDEX human_ai_sessions_owner_idx ON public.human_ai_sessions(owner_hash, created_at DESC);
CREATE OR REPLACE FUNCTION public.touch_human_ai_session() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER touch_human_ai_session BEFORE UPDATE ON public.human_ai_sessions FOR EACH ROW EXECUTE FUNCTION public.touch_human_ai_session();