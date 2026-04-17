import { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "app_error",
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="paper-grain relative flex min-h-screen flex-col">
        <div className="container mx-auto flex flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
          {/* Masthead */}
          <div className="mb-20 flex items-baseline justify-between border-b border-border pb-6 pt-8">
            <div className="flex items-baseline gap-4">
              <span className="section-number text-oxblood">erro</span>
              <span className="kicker text-oxblood">Falha</span>
            </div>
            <span className="kicker-muted">Erro inesperado</span>
          </div>

          <div className="flex flex-1 flex-col items-start justify-center">
            <p className="kicker mb-6 text-oxblood">Aviso editorial</p>

            <h1 className="mb-10 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em]">
              <span className="block text-foreground">Algo deu errado</span>
              <span className="display-italic block text-oxblood">
                nesta página.
              </span>
            </h1>

            <hr className="rule mb-10 w-full" />

            <p className="mb-12 max-w-xl text-base leading-[1.7] text-foreground/85 md:text-lg">
              Ocorreu um erro inesperado ao carregar esta página. Tente
              recarregar ou voltar ao início — se o problema persistir, fale
              conosco pelo WhatsApp.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                variant="hero"
                size="lg"
                className="gap-2"
                onClick={this.handleReload}
              >
                <RefreshCw aria-hidden="true" className="h-4 w-4" />
                Recarregar página
              </Button>
              <button
                onClick={this.handleGoHome}
                className="link-editorial"
              >
                ou voltar ao início →
              </button>
            </div>

            {import.meta.env.DEV && this.state.error ? (
              <details className="mt-16 w-full max-w-2xl border-y border-border py-4 text-xs text-muted-foreground">
                <summary className="cursor-pointer font-serif text-base italic text-foreground/80">
                  Detalhes do erro (dev)
                </summary>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words font-mono text-[0.7rem]">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            ) : null}
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
    );
  }
}

export default ErrorBoundary;
