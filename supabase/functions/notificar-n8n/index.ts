import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Allowed origins for CORS
const allowedOrigins = [
  "https://drjulianomachado.com.br",
  "https://www.drjulianomachado.com.br",
  /^https:\/\/.*\.lovable\.app$/,
  /^https:\/\/.*\.lovableproject\.com$/,
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (origin) {
    const isAllowed = allowedOrigins.some((allowed) => {
      if (typeof allowed === "string") {
        return allowed === origin;
      }
      return allowed.test(origin);
    });

    if (isAllowed) {
      headers["Access-Control-Allow-Origin"] = origin;
    }
  }

  return headers;
}

// Generate HMAC-SHA256 signature for webhook payload
async function generateHmacSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const payloadData = encoder.encode(payload);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, payloadData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface FetchRetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
}

interface FetchRetryResult {
  response?: Response;
  error?: unknown;
  attempts: number;
}

// fetch with exponential backoff on 5xx / network errors.
// 4xx is returned immediately (retrying won't change a client error).
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  opts: FetchRetryOptions = {}
): Promise<FetchRetryResult> {
  const { maxAttempts = 3, baseDelayMs = 500, timeoutMs = 10_000 } = opts;
  let lastError: unknown;
  let lastResponse: Response | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });

      // Non-retryable: 2xx success OR 4xx client error
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return { response, attempts: attempt };
      }

      lastResponse = response;
      console.warn(
        `[notificar-n8n] Attempt ${attempt}/${maxAttempts} returned HTTP ${response.status}`
      );
    } catch (err) {
      lastError = err;
      console.warn(
        `[notificar-n8n] Attempt ${attempt}/${maxAttempts} network error:`,
        err instanceof Error ? err.message : String(err)
      );
    }

    if (attempt < maxAttempts) {
      const delay = baseDelayMs * Math.pow(3, attempt - 1); // 500, 1500, 4500
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return { response: lastResponse, error: lastError, attempts: maxAttempts };
}

// Schema validation for n8n notification request
const n8nRequestSchema = z.object({
  evento: z.enum(["agendamento_criado", "status_crm_atualizado"], {
    errorMap: () => ({ message: "Evento deve ser 'agendamento_criado' ou 'status_crm_atualizado'" })
  }),
  dados_agendamento: z.object({
    id: z.string().uuid().optional(),
    nome_completo: z.string().max(200).optional(),
    telefone_whatsapp: z.string().max(20).optional(),
    email: z.string().email().max(255).optional().nullable(),
    data_nascimento: z.string().optional().nullable(),
    tipo_atendimento: z.string().max(50).optional(),
    local_atendimento: z.string().max(200).optional(),
    convenio: z.string().max(100).optional(),
    convenio_outro: z.string().max(100).optional().nullable(),
    data_agendamento: z.string().optional(),
    hora_agendamento: z.string().optional(),
    status_crm: z.string().max(50).optional(),
    observacoes_internas: z.string().max(2000).optional().nullable(),
    detalhe_exame_ou_cirurgia: z.string().max(500).optional().nullable(),
    aceita_primeiro_horario: z.boolean().optional().nullable(),
    aceita_contato_whatsapp_email: z.boolean().optional().nullable(),
    origem: z.string().max(100).optional().nullable(),
    created_at: z.string().optional().nullable(),
    updated_at: z.string().optional().nullable(),
  }).passthrough(), // Allow additional fields for flexibility
});

type N8nRequest = z.infer<typeof n8nRequestSchema>;

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Validate input
    const validationResult = n8nRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Dados inválidos", 
          details: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { evento, dados_agendamento }: N8nRequest = validationResult.data;

    console.log("Notificando n8n - Evento:", evento);
    console.log("Dados:", JSON.stringify(dados_agendamento).substring(0, 100) + "...");

    const n8nWebhookUrl = Deno.env.get("N8N_WEBHOOK_URL");
    const n8nWebhookSecret = Deno.env.get("N8N_WEBHOOK_SECRET");
    const requireHmac =
      (Deno.env.get("N8N_REQUIRE_HMAC") ?? "true").toLowerCase() !== "false";

    if (!n8nWebhookUrl) {
      console.error("N8N_WEBHOOK_URL não configurado");
      return new Response(
        JSON.stringify({ error: "Webhook n8n não configurado" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (requireHmac && !n8nWebhookSecret) {
      console.error(
        "N8N_WEBHOOK_SECRET ausente com N8N_REQUIRE_HMAC=true. Recuse envios não assinados."
      );
      return new Response(
        JSON.stringify({
          error:
            "Assinatura HMAC obrigatória: configure N8N_WEBHOOK_SECRET ou defina N8N_REQUIRE_HMAC=false explicitamente (não recomendado).",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prepare payload with timestamp and request ID for deduplication
    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const payload = JSON.stringify({
      evento,
      dados_agendamento,
      timestamp,
      request_id: requestId,
    });

    // Trace headers always present — n8n can dedupe on X-Request-ID even
    // when HMAC is disabled in dev.
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Request-ID": requestId,
      "X-Timestamp": timestamp,
    };

    if (n8nWebhookSecret) {
      const signature = await generateHmacSignature(payload, n8nWebhookSecret);
      requestHeaders["X-Webhook-Signature"] = `sha256=${signature}`;
      console.log(`[notificar-n8n] Assinatura HMAC anexada (request_id=${requestId})`);
    } else {
      console.warn(
        `[notificar-n8n] Enviando sem HMAC (N8N_REQUIRE_HMAC=false). request_id=${requestId}`
      );
    }

    const { response: n8nResponse, error: fetchError, attempts } = await fetchWithRetry(
      n8nWebhookUrl,
      {
        method: "POST",
        headers: requestHeaders,
        body: payload,
      },
      { maxAttempts: 3, baseDelayMs: 500, timeoutMs: 10_000 }
    );

    // All attempts failed (network/timeout/5xx after retries)
    if (!n8nResponse) {
      const errMessage =
        fetchError instanceof Error ? fetchError.message : String(fetchError ?? "unknown");
      console.error(
        `[notificar-n8n] Falha após ${attempts} tentativas (request_id=${requestId}):`,
        errMessage
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: "n8n webhook inalcançável após múltiplas tentativas",
          request_id: requestId,
          attempts,
          detail: errMessage,
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(
        `[notificar-n8n] n8n retornou ${n8nResponse.status} após ${attempts} tentativa(s) (request_id=${requestId}): ${errorText}`
      );
      // 4xx não é retentado; devolvemos o status real para o chamador ter visibilidade
      return new Response(
        JSON.stringify({
          success: false,
          error: `n8n retornou HTTP ${n8nResponse.status}`,
          request_id: requestId,
          attempts,
          detail: errorText.slice(0, 500),
        }),
        {
          status: n8nResponse.status >= 500 ? 502 : n8nResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    let n8nData;
    const responseText = await n8nResponse.text();
    try {
      n8nData = JSON.parse(responseText);
    } catch {
      n8nData = responseText;
    }

    console.log(
      `[notificar-n8n] OK em ${attempts} tentativa(s) (request_id=${requestId})`
    );

    return new Response(
      JSON.stringify({ success: true, data: n8nData, request_id: requestId, attempts }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("[notificar-n8n] Erro inesperado:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message ?? "unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
