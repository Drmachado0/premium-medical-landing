import { Button } from "@/components/ui/button";
import { CalendarCheck, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import drJulianoHero from "@/assets/dr-juliano-hero.png";
import { useGoogleTag } from "@/hooks/useGoogleTag";

interface HeroSectionProps {
  onScheduleClick: () => void;
}

const HeroSection = ({ onScheduleClick }: HeroSectionProps) => {
  const { trackCTAClick } = useGoogleTag();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = 6000;
    const duration = 2000;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="paper-grain relative overflow-hidden pt-28 pb-16 sm:pt-32 md:pt-36">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Masthead — editorial kicker */}
        <div className="mb-10 flex items-center justify-between opacity-0 animate-fade-in animation-delay-100">
          <span className="section-number">01</span>
          <span className="kicker-muted hidden sm:inline">
            Oftalmologia · Paragominas & Belém
          </span>
          <span className="kicker-muted font-serif italic">2026</span>
        </div>

        <hr className="rule mb-14 opacity-0 animate-fade-in animation-delay-200" />

        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Content column */}
          <div className="order-2 lg:order-1">
            <p className="kicker mb-8 opacity-0 animate-slide-up animation-delay-300">
              Uma carta ao seu olhar
            </p>

            <h1 className="mb-10 text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.03em] opacity-0 animate-slide-up animation-delay-400">
              <span className="block text-foreground">Enxergar bem,</span>
              <span className="display-italic block text-ochre">
                muda tudo.
              </span>
            </h1>

            <div className="mb-12 max-w-xl space-y-5 opacity-0 animate-slide-up animation-delay-500">
              <p className="text-base leading-[1.65] text-foreground/85 md:text-lg">
                <span className="font-serif italic text-primary">
                  Dr. Juliano Machado
                </span>{" "}
                devolveu clareza para mais de{" "}
                <span className="tabular-nums font-medium text-foreground">
                  {count.toLocaleString("pt-BR")}
                </span>{" "}
                pacientes em Paragominas e Belém. Do primeiro exame à
                cirurgia — cada consulta é conduzida como uma conversa, não
                como um procedimento.
              </p>
            </div>

            <div className="mb-14 flex flex-col gap-3 sm:flex-row sm:items-center opacity-0 animate-slide-up animation-delay-600">
              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  trackCTAClick("agendar_consulta", "hero", "Agendar consulta");
                  onScheduleClick();
                }}
                className="gap-2"
              >
                <CalendarCheck aria-hidden="true" className="h-4 w-4" />
                Agendar consulta
              </Button>

              <button
                type="button"
                onClick={() => {
                  trackCTAClick("saiba_mais", "hero", "Ver procedimentos");
                  document
                    .getElementById("procedimentos")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="link-editorial text-base"
              >
                ou conhecer os procedimentos ↓
              </button>
            </div>

            {/* Credential strip */}
            <div className="grid max-w-xl grid-cols-3 gap-0 divide-x divide-border border-y border-border opacity-0 animate-fade-in animation-delay-700">
              <Figure
                value={`${count.toLocaleString("pt-BR")}+`}
                label="pacientes"
              />
              <Figure value="5.0" label="nota no Google" />
              <Figure value="13" label="anos de clínica" />
            </div>
          </div>

          {/* Photo column */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end opacity-0 animate-scale-in animation-delay-300">
            <figure className="relative">
              <div className="relative h-[28rem] w-[21rem] overflow-hidden border border-border bg-card paper-grain sm:h-[32rem] sm:w-[24rem] lg:h-[36rem] lg:w-[26rem]">
                <img
                  src={drJulianoHero}
                  alt="Dr. Juliano Machado, médico oftalmologista"
                  className="h-full w-full object-cover object-top grayscale-[0.15] contrast-[1.05]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
                <span className="font-serif text-lg italic text-foreground">
                  Dr. Juliano Machado
                </span>
                <span className="caption">CRM-PA · Oftalmologista</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Scroll cue */}
        <button
          onClick={() =>
            document
              .getElementById("sobre")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-20 hidden items-center gap-3 text-muted-foreground transition-colors hover:text-primary lg:inline-flex"
          aria-label="Rolar para a próxima seção"
        >
          <span className="kicker-muted">Continuar leitura</span>
          <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

interface FigureProps {
  value: string;
  label: string;
}

const Figure = ({ value, label }: FigureProps) => (
  <div className="flex flex-col items-start gap-1 px-4 py-5 first:pl-0">
    <span className="font-serif text-3xl tabular-nums leading-none text-foreground md:text-4xl">
      {value}
    </span>
    <span className="kicker-muted text-[0.65rem]">{label}</span>
  </div>
);

export default HeroSection;
