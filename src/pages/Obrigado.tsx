import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Obrigado = () => {
  useEffect(() => {
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Lead", {
        content_name: "Agendamento Solicitado",
        content_category: "Consulta Oftalmológica",
        value: 300,
        currency: "BRL",
      });
      (window as any).fbq("track", "CompleteRegistration", {
        content_name: "Página Obrigado",
        value: 300,
        currency: "BRL",
      });
    }

    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-436492720/3Y-4COmQ1dUbELCzkdAB",
        value: 300,
        currency: "BRL",
      });
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "meta_lead",
      content_name: "Agendamento Solicitado",
    });
    window.dataLayer.push({
      event: "google_ads_conversion",
      send_to: "AW-436492720/3Y-4COmQ1dUbELCzkdAB",
      value: 300,
      currency: "BRL",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Solicitação Recebida | Dr. Juliano Machado</title>
        <meta
          name="description"
          content="Sua solicitação de consulta com o Dr. Juliano Machado foi recebida. Em breve entraremos em contato pelo WhatsApp para confirmar."
        />
      </Helmet>

      <main className="paper-grain relative min-h-screen overflow-hidden">
        <div className="container mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-16 sm:px-6 lg:px-8">
          {/* Masthead */}
          <div className="mb-20 flex items-baseline justify-between border-b border-border pb-6 pt-8 opacity-0 animate-fade-in animation-delay-100">
            <div className="flex items-baseline gap-4">
              <span className="section-number">§§</span>
              <span className="kicker">Confirmação</span>
            </div>
            <span className="kicker-muted">Consulta</span>
          </div>

          {/* Main */}
          <div className="flex flex-1 flex-col items-start justify-center">
            <p className="kicker mb-6 opacity-0 animate-slide-up animation-delay-200">
              Tudo certo
            </p>

            <h1 className="mb-10 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.03em] opacity-0 animate-slide-up animation-delay-300">
              <span className="block text-foreground">Sua solicitação</span>
              <span className="display-italic block text-ochre">foi recebida.</span>
            </h1>

            <hr className="rule w-full mb-10 opacity-0 animate-fade-in animation-delay-400" />

            <div className="mb-12 max-w-xl opacity-0 animate-slide-up animation-delay-500">
              <p className="dropcap text-base leading-[1.7] text-foreground/85 md:text-lg">
                Nossa equipe entrará em contato pelo WhatsApp em poucos
                minutos para confirmar o melhor horário. Se preferir, inicie a
                conversa agora mesmo — estamos aqui.
              </p>
            </div>

            {/* Info list — editorial */}
            <div className="mb-14 grid w-full max-w-xl gap-0 border-y border-border opacity-0 animate-slide-up animation-delay-600">
              <InfoRow
                num="i."
                label="Confirmação"
                value="Em até 2h úteis, via WhatsApp"
              />
              <InfoRow
                num="ii."
                label="Locais"
                value="Paragominas e Belém, PA"
              />
              <InfoRow
                num="iii."
                label="Observação"
                value="Cancele quando quiser, sem custo"
              />
            </div>

            <div className="flex flex-col gap-4 opacity-0 animate-slide-up animation-delay-700 sm:flex-row sm:items-center">
              <a
                href="https://wa.me/5591936180476?text=Ol%C3%A1!%20Acabei%20de%20solicitar%20minha%20consulta%20com%20o%20Dr.%20Juliano%20Machado."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="hero" size="lg" className="gap-2">
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  Falar no WhatsApp
                </Button>
              </a>
              <Link to="/" className="link-editorial">
                ← Voltar ao site
              </Link>
            </div>
          </div>

          {/* Colophon */}
          <footer className="mt-20 border-t border-border pt-6 text-xs text-muted-foreground">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-sm italic text-foreground">
                Dr. Juliano Machado
              </span>
              <span>CRM-PA · Oftalmologista</span>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

interface InfoRowProps {
  num: string;
  label: string;
  value: string;
}

const InfoRow = ({ num, label, value }: InfoRowProps) => (
  <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-6 border-b border-border/60 py-4 last:border-b-0 sm:gap-10">
    <span className="font-serif text-xs italic text-primary">{num}</span>
    <span className="kicker-muted">{label}</span>
    <span className="font-serif text-sm text-foreground md:text-base">
      {value}
    </span>
  </div>
);

export default Obrigado;
