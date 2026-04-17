import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  buscarAvaliacoesGoogle,
  type AvaliacaoGoogle,
} from "@/services/avaliacoesGoogle";

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  image?: string;
  rating: 4 | 5;
  text: string;
  date: string;
  source: "Google";
}

const AUTO_ROTATE_INTERVAL = 10000;

function convertToTestimonial(avaliacao: AvaliacaoGoogle): Testimonial {
  const initials = avaliacao.author_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    id: avaliacao.id,
    name: avaliacao.author_name,
    avatar: initials,
    image: avaliacao.author_photo_url || undefined,
    rating: (avaliacao.rating >= 4 ? avaliacao.rating : 4) as 4 | 5,
    text: avaliacao.text || "Excelente atendimento.",
    date: avaliacao.relative_time_description || "Avaliação recente",
    source: "Google",
  };
}

const GoogleMark = () => (
  <svg
    aria-hidden="true"
    className="h-3 w-3"
    viewBox="0 0 24 24"
    role="img"
  >
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayed, setDisplayed] = useState<Testimonial[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: avaliacoesGoogle, isLoading } = useQuery({
    queryKey: ["avaliacoes-google"],
    queryFn: buscarAvaliacoesGoogle,
    staleTime: 1000 * 60 * 30,
  });

  const allTestimonials = useMemo(() => {
    if (avaliacoesGoogle && avaliacoesGoogle.length > 0) {
      return avaliacoesGoogle.map(convertToTestimonial);
    }
    return [];
  }, [avaliacoesGoogle]);

  const shuffle = useCallback((array: Testimonial[]): Testimonial[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const loadNew = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setDisplayed(shuffle(allTestimonials).slice(0, 3));
      setIsTransitioning(false);
    }, 400);
  }, [shuffle, allTestimonials]);

  useEffect(() => {
    if (allTestimonials.length > 0) {
      setDisplayed(shuffle(allTestimonials).slice(0, 3));
    }
  }, [shuffle, allTestimonials]);

  useEffect(() => {
    if (isHovered || allTestimonials.length <= 3) {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
      return;
    }
    autoRotateRef.current = setInterval(loadNew, AUTO_ROTATE_INTERVAL);
    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [isHovered, loadNew, allTestimonials.length]);

  const averageRating = useMemo(() => {
    if (displayed.length === 0) return "5.0";
    const sum = displayed.reduce((acc, t) => acc + t.rating, 0);
    return (sum / displayed.length).toFixed(1);
  }, [displayed]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="paper-grain relative py-24 md:py-32"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className={`mb-16 flex items-baseline justify-between border-b border-border pb-6 transition-all duration-700 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-baseline gap-4">
            <span className="section-number">04</span>
            <span className="kicker">Depoimentos</span>
          </div>
          <span className="kicker-muted hidden items-center gap-2 sm:inline-flex">
            <GoogleMark /> {averageRating} · {allTestimonials.length}{" "}
            avaliações
          </span>
        </div>

        <div className="mb-12 max-w-3xl">
          <h2 className="text-[clamp(2rem,3.8vw,3.5rem)] leading-[0.95] tracking-[-0.025em] text-foreground">
            <span className="display-italic text-ochre">"</span>Nota máxima no
            Google,{" "}
            <span className="display-italic text-ochre">
              nas palavras deles.
            </span>
            <span className="display-italic text-ochre">"</span>
          </h2>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2
              aria-hidden="true"
              className="h-5 w-5 animate-spin text-primary"
            />
            <span className="ml-3 text-sm">Carregando avaliações…</span>
          </div>
        )}

        {!isLoading && allTestimonials.length === 0 && (
          <div className="py-16 text-center text-sm italic text-muted-foreground">
            Ainda não há avaliações para exibir.
          </div>
        )}

        {/* Testimonials — editorial 3-column */}
        <div
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {displayed.map((t, index) => (
            <article
              key={t.id}
              className={`flex flex-col border-t-2 border-primary pt-6 transition-all duration-500 ${
                isVisible
                  ? isTransitioning
                    ? "translate-y-2 opacity-0"
                    : "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay:
                  isVisible && !isTransitioning ? `${index * 80}ms` : "0ms",
              }}
            >
              <p className="mb-6 flex items-baseline gap-1 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                <GoogleMark />
                <span>{t.date}</span>
                <span className="mx-1">·</span>
                <span className="tabular-nums">{t.rating}.0 ★</span>
              </p>

              <blockquote className="mb-8 flex-1 font-serif text-xl leading-[1.35] tracking-[-0.01em] text-foreground md:text-2xl">
                <span className="display-italic text-ochre">"</span>
                {t.text}
                <span className="display-italic text-ochre">"</span>
              </blockquote>

              <footer className="flex items-center gap-3 border-t border-border pt-4">
                {t.image ? (
                  <img
                    src={t.image}
                    alt=""
                    aria-hidden="true"
                    className="h-9 w-9 rounded-full object-cover grayscale"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center border border-border text-xs text-muted-foreground">
                    {t.avatar}
                  </div>
                )}
                <div className="flex flex-col">
                  <cite className="not-italic font-serif text-sm text-foreground">
                    {t.name}
                  </cite>
                  <span className="caption">Avaliação verificada</span>
                </div>
              </footer>
            </article>
          ))}
        </div>

        {/* Read more */}
        <div className="mt-16 flex justify-center">
          <a
            href="https://g.page/r/CTkTpXB1m13mEBI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="link-editorial group inline-flex items-baseline gap-2 text-base"
          >
            <GoogleMark />
            <span>Ler todas as avaliações no Google</span>
            <ArrowRight
              aria-hidden="true"
              className="h-3 w-3 translate-y-[-1px] transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
