import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Página não encontrada | Dr. Juliano Machado</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <main className="hero-gradient noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 50%, hsl(42 85% 54% / 0.08), transparent 70%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="h-[28rem] w-[28rem] rounded-full border border-primary/10" />
          <span className="absolute h-[18rem] w-[18rem] rounded-full border border-primary/15" />
          <span className="absolute h-[10rem] w-[10rem] rounded-full border border-primary/20" />
        </div>

        <div className="container relative z-10 mx-auto max-w-xl text-center">
          <div className="animate-scale-in mb-8 inline-flex">
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-card/60 backdrop-blur-sm">
              <span
                aria-hidden="true"
                className="absolute inset-0 -m-2 rounded-full bg-primary/10 blur-xl"
              />
              <Eye
                aria-hidden="true"
                className="relative h-8 w-8 text-primary"
                strokeWidth={1.5}
              />
            </span>
          </div>

          <p className="animate-fade-in animation-delay-100 mb-3 text-xs uppercase tracking-[0.2em] text-primary/80">
            Erro 404
          </p>

          <h1 className="animate-slide-up animation-delay-200 mb-5 text-balance text-4xl font-bold leading-[1.1] md:text-5xl">
            <span className="gradient-text">
              Esta página saiu do seu campo de visão
            </span>
          </h1>

          <p className="animate-slide-up animation-delay-300 mb-10 text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            O endereço que você acessou não existe ou foi movido. Volte para a
            página inicial e continue por um caminho seguro.
          </p>

          <div className="animate-slide-up animation-delay-400 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/">
              <Button variant="hero" size="lg" className="gap-2">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Voltar ao início
              </Button>
            </Link>
            <Link to="/agendar">
              <Button variant="outline" size="lg">
                Agendar consulta
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
