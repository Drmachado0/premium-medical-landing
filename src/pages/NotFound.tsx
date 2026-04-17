import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
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

      <main className="paper-grain relative flex min-h-screen flex-col">
        <div className="container mx-auto flex flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
          {/* Masthead */}
          <div className="mb-20 flex items-baseline justify-between border-b border-border pb-6 pt-8">
            <div className="flex items-baseline gap-4">
              <span className="section-number">404</span>
              <span className="kicker">Errata</span>
            </div>
            <span className="kicker-muted">Página não encontrada</span>
          </div>

          <div className="flex flex-1 flex-col items-start justify-center">
            <p className="kicker mb-6 animate-fade-in animation-delay-100">
              Redação nota
            </p>

            <h1 className="mb-10 text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.95] tracking-[-0.03em] animate-slide-up animation-delay-200">
              <span className="block text-foreground">Esta página saiu</span>
              <span className="display-italic block text-ochre">
                do seu campo de visão.
              </span>
            </h1>

            <hr className="rule mb-10 w-full animate-fade-in animation-delay-300" />

            <p className="dropcap mb-12 max-w-xl text-base leading-[1.7] text-foreground/85 animate-slide-up animation-delay-400 md:text-lg">
              O endereço que você acessou não existe ou foi movido para outro
              lugar. Volte para a página inicial ou agende sua consulta — nós
              seguimos aqui.
            </p>

            <div className="flex flex-col gap-4 animate-slide-up animation-delay-500 sm:flex-row sm:items-center">
              <Link to="/">
                <Button variant="hero" size="lg" className="gap-2">
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Voltar ao início
                </Button>
              </Link>
              <Link to="/agendar" className="link-editorial">
                ou agendar consulta →
              </Link>
            </div>
          </div>

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

export default NotFound;
