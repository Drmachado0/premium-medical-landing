import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_NOTIFICATION_EMAIL =
  Deno.env.get("ADMIN_NOTIFICATION_EMAIL") ?? "julianosmachado@gmail.com";
const RESEND_FROM_EMAIL =
  Deno.env.get("RESEND_FROM_EMAIL") ??
  "Agendamentos Dr. Juliano <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AgendamentoEmailRequest {
  nome_completo: string;
  telefone_whatsapp: string;
  email_paciente?: string;
  data_nascimento?: string;
  tipo_atendimento: string;
  detalhe_exame_ou_cirurgia?: string;
  local_atendimento: string;
  convenio: string;
  convenio_outro?: string;
  data_agendamento: string;
  hora_agendamento: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email?: string): email is string {
  if (!email) return false;
  const trimmed = email.trim();
  return trimmed.length > 0 && trimmed.length <= 254 && EMAIL_REGEX.test(trimmed);
}

function escapeHtml(text: string): string {
  if (!text) return "";
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

function formatarData(dataString: string): string {
  try {
    const data = new Date(dataString + "T00:00:00");
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return escapeHtml(dataString);
  }
}

interface RenderedFields {
  nomeCompleto: string;
  telefoneWhatsapp: string;
  localAtendimento: string;
  tipoAtendimento: string;
  horaAgendamento: string;
  dataFormatada: string;
  convenioFinal: string;
  detalheAtendimento: string;
  dataNascimento: string;
  emailPacienteLine: string;
}

function renderFields(dados: AgendamentoEmailRequest): RenderedFields {
  const convenioFinal =
    dados.convenio === "Outro" && dados.convenio_outro
      ? escapeHtml(dados.convenio_outro)
      : escapeHtml(dados.convenio);

  return {
    nomeCompleto: escapeHtml(dados.nome_completo),
    telefoneWhatsapp: escapeHtml(dados.telefone_whatsapp),
    localAtendimento: escapeHtml(dados.local_atendimento),
    tipoAtendimento: escapeHtml(dados.tipo_atendimento),
    horaAgendamento: escapeHtml(dados.hora_agendamento),
    dataFormatada: formatarData(dados.data_agendamento),
    convenioFinal,
    detalheAtendimento: dados.detalhe_exame_ou_cirurgia
      ? `<p><strong>Detalhe:</strong> ${escapeHtml(dados.detalhe_exame_ou_cirurgia)}</p>`
      : "",
    dataNascimento: dados.data_nascimento
      ? `<p><strong>Data de Nascimento:</strong> ${formatarData(dados.data_nascimento)}</p>`
      : "",
    emailPacienteLine: dados.email_paciente
      ? `<p><strong>E-mail:</strong> ${escapeHtml(dados.email_paciente)}</p>`
      : "",
  };
}

function buildAdminHtml(f: RenderedFields): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e3a5f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #1e3a5f; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-bottom: 10px; }
        .highlight { background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #c9a227; }
        .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗓️ Novo Agendamento</h1>
          <p>Dr. Juliano Machado - Oftalmologia</p>
        </div>
        <div class="content">
          <div class="highlight">
            <strong>📅 ${f.dataFormatada} às ${f.horaAgendamento}</strong><br>
            <strong>📍 ${f.localAtendimento}</strong>
          </div>
          <div class="section">
            <h3>👤 Dados do Paciente</h3>
            <p><strong>Nome:</strong> ${f.nomeCompleto}</p>
            <p><strong>WhatsApp:</strong> ${f.telefoneWhatsapp}</p>
            ${f.emailPacienteLine}
            ${f.dataNascimento}
          </div>
          <div class="section">
            <h3>📋 Detalhes da Consulta</h3>
            <p><strong>Tipo:</strong> ${f.tipoAtendimento}</p>
            ${f.detalheAtendimento}
            <p><strong>Convênio:</strong> ${f.convenioFinal}</p>
          </div>
        </div>
        <div class="footer">
          <p>Este e-mail foi enviado automaticamente pelo sistema de agendamentos.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildPatientHtml(f: RenderedFields): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e3a5f; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 24px; border: 1px solid #ddd; }
        .greeting { font-size: 16px; margin-bottom: 16px; }
        .highlight { background-color: #fff3cd; padding: 18px; border-radius: 5px; border-left: 4px solid #c9a227; margin: 20px 0; font-size: 16px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #1e3a5f; border-bottom: 2px solid #c9a227; padding-bottom: 5px; margin-bottom: 10px; }
        .note { background-color: #e8f4fa; padding: 14px; border-radius: 5px; border-left: 4px solid #1e3a5f; margin: 16px 0; font-size: 14px; }
        .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Agendamento Recebido</h1>
          <p>Dr. Juliano Machado - Oftalmologia</p>
        </div>
        <div class="content">
          <p class="greeting">Olá, <strong>${f.nomeCompleto}</strong>! 👋</p>
          <p>Recebemos sua solicitação de agendamento. Confira os dados abaixo:</p>

          <div class="highlight">
            <strong>📅 ${f.dataFormatada}</strong><br>
            <strong>🕒 Horário: ${f.horaAgendamento}</strong><br>
            <strong>📍 Local: ${f.localAtendimento}</strong>
          </div>

          <div class="section">
            <h3>📋 Resumo</h3>
            <p><strong>Tipo de atendimento:</strong> ${f.tipoAtendimento}</p>
            ${f.detalheAtendimento}
            <p><strong>Convênio:</strong> ${f.convenioFinal}</p>
          </div>

          <div class="note">
            <strong>📱 Próximos passos:</strong> Em breve você receberá uma mensagem no WhatsApp
            (${f.telefoneWhatsapp}) para confirmar seu agendamento. Caso precise remarcar ou
            cancelar, responda por lá ou entre em contato com a clínica.
          </div>
        </div>
        <div class="footer">
          <p>Este e-mail foi enviado automaticamente. Não é necessário respondê-lo.</p>
          <p>Dr. Juliano Machado - Oftalmologia</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

interface SendEmailArgs {
  to: string[];
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailArgs): Promise<{
  ok: boolean;
  status: number;
  body: unknown;
}> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  const body = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, body };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("notificar-agendamento-email: Iniciando...");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const dados: AgendamentoEmailRequest = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não configurada");
    }

    const fields = renderFields(dados);
    const subject = `Novo Agendamento: ${fields.nomeCompleto} - ${fields.dataFormatada} ${fields.horaAgendamento}`;
    const patientSubject = `Confirmação de agendamento - ${fields.dataFormatada} ${fields.horaAgendamento}`;

    const adminHtml = buildAdminHtml(fields);
    const patientHtml = buildPatientHtml(fields);

    const patientEmail = dados.email_paciente?.trim();
    const sendToPatient = isValidEmail(patientEmail);

    if (dados.email_paciente && !sendToPatient) {
      console.warn(
        `E-mail do paciente ignorado (formato inválido): ${dados.email_paciente}`
      );
    }

    console.log(
      `Enviando e-mails. Admin=${ADMIN_NOTIFICATION_EMAIL} | Paciente=${sendToPatient ? patientEmail : "-"}`
    );

    const adminPromise = sendEmail({
      to: [ADMIN_NOTIFICATION_EMAIL],
      subject,
      html: adminHtml,
    });

    const patientPromise = sendToPatient
      ? sendEmail({
          to: [patientEmail!],
          subject: patientSubject,
          html: patientHtml,
        })
      : Promise.resolve(null);

    const [adminResult, patientResult] = await Promise.allSettled([
      adminPromise,
      patientPromise,
    ]);

    const adminOk =
      adminResult.status === "fulfilled" && adminResult.value.ok;
    const patientOk =
      patientResult.status === "fulfilled" &&
      (patientResult.value === null || patientResult.value.ok);

    if (adminResult.status === "rejected") {
      console.error("Falha envio admin:", adminResult.reason);
    } else if (!adminResult.value.ok) {
      console.error("Resend retornou erro (admin):", adminResult.value.body);
    }

    if (patientResult.status === "rejected") {
      console.error("Falha envio paciente:", patientResult.reason);
    } else if (
      patientResult.value !== null &&
      !patientResult.value.ok
    ) {
      console.error("Resend retornou erro (paciente):", patientResult.value.body);
    }

    if (!adminOk && !patientOk) {
      const adminBody =
        adminResult.status === "fulfilled" ? adminResult.value.body : null;
      throw new Error(
        (adminBody && typeof adminBody === "object" && "message" in adminBody
          ? String((adminBody as { message: unknown }).message)
          : null) ?? "Falha ao enviar todos os e-mails"
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        admin: {
          sent: adminOk,
          to: ADMIN_NOTIFICATION_EMAIL,
          response:
            adminResult.status === "fulfilled" ? adminResult.value.body : null,
        },
        patient: {
          sent: patientOk && sendToPatient,
          attempted: sendToPatient,
          to: sendToPatient ? patientEmail : null,
          response:
            patientResult.status === "fulfilled" && patientResult.value !== null
              ? patientResult.value.body
              : null,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Erro ao enviar email:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
