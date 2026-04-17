import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import RouteChangeTracker from "./components/RouteChangeTracker";
import Index from "./pages/Index";
import Agendar from "./pages/Agendar";
import Obrigado from "./pages/Obrigado";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminAgendamentos = lazy(() => import("./pages/admin/Agendamentos"));
const AdminCRM = lazy(() => import("./pages/admin/CRM"));
const AdminWhatsApp = lazy(() => import("./pages/admin/WhatsApp"));
const AdminAgenda = lazy(() => import("./pages/admin/Agenda"));
const AdminDisponibilidade = lazy(() => import("./pages/admin/Disponibilidade"));
const AdminProfissionais = lazy(() => import("./pages/admin/Profissionais"));
const AdminConfiguracoes = lazy(() => import("./pages/admin/Configuracoes"));
const AdminAvaliacoes = lazy(() => import("./pages/admin/Avaliacoes"));
const AdminLembretes = lazy(() => import("./pages/admin/Lembretes"));
const AdminConfiguracoesEvolution = lazy(
  () => import("./pages/admin/ConfiguracoesEvolution"),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

const AdminFallback = () => (
  <div className="hero-gradient flex min-h-screen items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
      />
      <p className="text-sm text-muted-foreground">Carregando painel…</p>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <RouteChangeTracker />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/agendar" element={<Agendar />} />
                  <Route path="/obrigado" element={<Obrigado />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/admin"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminDashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/agendamentos"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminAgendamentos />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/agenda"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminAgenda />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/disponibilidade"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminDisponibilidade />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/profissionais"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminProfissionais />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/crm"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminCRM />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/lembretes"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminLembretes />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/avaliacoes"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminAvaliacoes />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/whatsapp"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminWhatsApp />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/configuracoes"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminConfiguracoes />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/admin/configuracoes/evolution"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <AdminConfiguracoesEvolution />
                      </Suspense>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
