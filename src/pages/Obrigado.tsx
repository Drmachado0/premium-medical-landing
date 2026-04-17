import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, MessageCircle, MapPin, Clock } from "lucide-react";
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

      <main className="hero-gradient noise-overlay relative min-h-screen overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, hsl(42 85% 54% / 0.10), transparent 70%)",
          }}
        />

        <div className="container relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
          <div className="animate-scale-in relative mb-8">
            <span
              aria-hidden="true"
              className="absolute inset-0 -m-4 rounded-full bg-primary/15 blur-2xl"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 -m-2 rounded-full border border-primary/30"
            />
            <CheckCircle2
              className="relative h-20 w-20 text-primary"
              strokeWidth={1.5}
            />
          </div>

          <p className="animate-fade-in animation-delay-100 mb-3 text-xs uppercase tracking-[0.2em] text-primary/80">
            Tudo certo
          </p>

          <h1 className="animate-slide-up animation-delay-200 mb-5 text-balance text-4xl font-bold leading-[1.1] md:text-5xl">
            <span className="gradient-text">Solicitação recebida!</span>
          </h1>

          <p className="animate-slide-up animation-delay-300 mb-10 max-w-md text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            Sua consulta com o Dr. Juliano Machado foi solicitada com sucesso.
            Nossa equipe entrará em contato pelo WhatsApp para confirmar o
            melhor horário.
          </p>

          <div className="animate-slide-up animation-delay-400 card-premium noise-overlay mb-10 w-full max-w-md space-y-4 rounded-2xl p-6 text-left">
            <div className="flex items-start gap-3">
              <MessageCircle
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              />
              <p className="text-sm leading-relaxed text-foreground/90">
                Nossa equipe entrará em contato para confirmar o agendamento.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              />
              <p className="text-sm leading-relaxed text-foreground/90">
                Paragominas e Belém, PA
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Clock
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              />
              <p className="text-sm leading-relaxed text-foreground/90">
                Confirmação enviada pelo WhatsApp em minutos.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/5591936180476?text=Ol%C3%A1!%20Acabei%20de%20solicitar%20minha%20consulta%20com%20o%20Dr.%20Juliano%20Machado."
            target="_blank"
            rel="noopener noreferrer"
            className="animate-slide-up animation-delay-500 w-full max-w-md"
          >
            <Button variant="whatsapp" size="lg" className="w-full gap-2">
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              Falar pelo WhatsApp
            </Button>
          </a>

          <Link
            to="/"
            className="ease-out-expo mt-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Voltar ao site
          </Link>

          <footer className="mt-16 space-y-1 text-center text-xs text-muted-foreground/70">
            <p className="font-serif text-sm text-foreground/80">
              Dr. Juliano Machado
            </p>
            <p>Oftalmologista · CRM-PA 12345</p>
            <p>Cirurgia de Catarata · Glaucoma · Retina</p>
          </footer>
        </div>
      </main>
    </>
  );
};

export default Obrigado;
