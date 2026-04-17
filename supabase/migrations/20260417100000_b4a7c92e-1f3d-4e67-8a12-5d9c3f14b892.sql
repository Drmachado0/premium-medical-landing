-- Eliminate scheduling double-booking and unify availability checks.
--
-- Problem: _shared/validarDisponibilidade.ts (backend) and
-- src/services/disponibilidadePublica.ts (UI) ran independent, multi-query
-- validations, creating a TOCTOU race between the check and the INSERT.
-- Two concurrent requests could both pass validation and both INSERT,
-- producing two appointments on the same slot.
--
-- Fix: (1) a partial UNIQUE index enforces one appointment per slot at
-- the database level — the INSERT itself becomes the arbiter. (2) a
-- canonical verificar_slot_disponivel RPC replaces the hand-rolled
-- TypeScript validation, giving a single source of truth both paths can
-- call.

-- 1. Partial unique index — any row on (clinica_id, data, hora) blocks
--    further bookings, matching current UI/backend behavior (the delete
--    or clinica_id=NULL is the release signal).
CREATE UNIQUE INDEX IF NOT EXISTS agendamentos_slot_unique
  ON public.agendamentos (clinica_id, data_agendamento, hora_agendamento)
  WHERE clinica_id IS NOT NULL
    AND data_agendamento IS NOT NULL
    AND hora_agendamento IS NOT NULL;

-- 2. Canonical single-slot availability RPC.
--    Combines the three checks that previously lived in TypeScript:
--      a) slot is within the weekly grid for that clinic
--      b) slot is not covered by a block (dia inteiro OR interval)
--      c) slot is not already taken
--    Plus a past-time guard using America/Sao_Paulo (the system tz).
CREATE OR REPLACE FUNCTION public.verificar_slot_disponivel(
  p_clinica_id uuid,
  p_data date,
  p_hora time
)
RETURNS TABLE (
  disponivel boolean,
  motivo text,
  codigo text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_dia_semana int;
  v_grade_count int;
  v_bloqueio_count int;
  v_agendamento_count int;
BEGIN
  IF p_clinica_id IS NULL THEN
    RETURN QUERY SELECT false, 'Clínica não informada.'::text, 'CLINICA_INVALIDA'::text;
    RETURN;
  END IF;

  IF p_data IS NULL OR p_hora IS NULL THEN
    RETURN QUERY SELECT false, 'Data e hora são obrigatórias.'::text, 'PARAMETROS_INVALIDOS'::text;
    RETURN;
  END IF;

  -- Past-time guard (30 min margin). Use Sao_Paulo because the app's
  -- slots are stored as naive local times.
  IF (p_data::timestamp + p_hora)
     < ((now() AT TIME ZONE 'America/Sao_Paulo') + interval '30 minutes') THEN
    RETURN QUERY SELECT false, 'Este horário já passou.'::text, 'HORARIO_PASSADO'::text;
    RETURN;
  END IF;

  v_dia_semana := EXTRACT(DOW FROM p_data)::int;

  -- (a) Weekly grid contains this slot?
  SELECT count(*) INTO v_grade_count
  FROM public.disponibilidade_semanal
  WHERE clinica_id = p_clinica_id
    AND dia_semana = v_dia_semana
    AND ativo = true
    AND hora_inicio <= p_hora
    AND hora_fim > p_hora;

  IF v_grade_count = 0 THEN
    RETURN QUERY SELECT false,
      'Esta clínica não atende neste horário.'::text,
      'FORA_DA_GRADE'::text;
    RETURN;
  END IF;

  -- (b) Blocked? A block with NULL hora_inicio means full-day.
  SELECT count(*) INTO v_bloqueio_count
  FROM public.bloqueios_agenda
  WHERE (clinica_id = p_clinica_id OR clinica_id IS NULL)
    AND data = p_data
    AND (
      hora_inicio IS NULL
      OR (hora_inicio <= p_hora AND hora_fim > p_hora)
    );

  IF v_bloqueio_count > 0 THEN
    RETURN QUERY SELECT false,
      'Este horário está bloqueado na agenda.'::text,
      'HORARIO_BLOQUEADO'::text;
    RETURN;
  END IF;

  -- (c) Already taken?
  SELECT count(*) INTO v_agendamento_count
  FROM public.agendamentos
  WHERE clinica_id = p_clinica_id
    AND data_agendamento = p_data
    AND hora_agendamento = p_hora;

  IF v_agendamento_count > 0 THEN
    RETURN QUERY SELECT false,
      'Este horário já foi reservado.'::text,
      'HORARIO_OCUPADO'::text;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, NULL::text, NULL::text;
END;
$$;

-- Exposed to every caller: the UI (anon/authenticated) can use it for
-- pre-flight UX, and edge functions (service_role) for the definitive
-- server-side check before INSERT.
GRANT EXECUTE ON FUNCTION public.verificar_slot_disponivel(uuid, date, time)
  TO anon, authenticated, service_role;
