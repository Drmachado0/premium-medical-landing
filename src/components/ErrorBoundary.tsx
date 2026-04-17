import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
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
      <main className="hero-gradient noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 40%, hsl(0 80% 58% / 0.10), transparent 70%)",
          }}
        />

        <div className="container relative z-10 mx-auto max-w-xl text-center">
          <div className="animate-scale-in mb-8 inline-flex">
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 bg-card/60 backdrop-blur-sm">
              <span
                aria-hidden="true"
                className="absolute inset-0 -m-2 rounded-full bg-destructive/10 blur-xl"
              />
              <AlertTriangle
                aria-hidden="true"
                className="relative h-8 w-8 text-destructive"
                strokeWidth={1.5}
              />
            </span>
          </div>

          <p className="animate-fade-in animation-delay-100 mb-3 text-xs uppercase tracking-[0.2em] text-destructive/80">
            Erro inesperado
          </p>

          <h1 className="animate-slide-up animation-delay-200 mb-5 text-balance text-3xl font-bold leading-[1.1] md:text-4xl">
            <span className="gradient-text">Algo deu errado</span>
          </h1>

          <p className="animate-slide-up animation-delay-300 mb-10 text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            Ocorreu um erro inesperado ao carregar esta página. Tente recarregar
            ou voltar ao início — se o problema persistir, fale conosco pelo
            WhatsApp.
          </p>

          <div className="animate-slide-up animation-delay-400 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="hero"
              size="lg"
              className="gap-2"
              onClick={this.handleReload}
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Recarregar página
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={this.handleGoHome}
            >
              Voltar ao início
            </Button>
          </div>

          {import.meta.env.DEV && this.state.error ? (
            <details className="mt-10 rounded-xl border border-border/50 bg-card/60 p-4 text-left text-xs text-muted-foreground">
              <summary className="cursor-pointer font-medium text-foreground/80">
                Detalhes do erro (modo dev)
              </summary>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words font-mono">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          ) : null}
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
