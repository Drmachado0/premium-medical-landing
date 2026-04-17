import { useEffect, useRef, useState } from "react";
import {
  RetinografiaIcon,
  MapeamentoRetinaIcon,
  TonometriaIcon,
  GonioscopiaIcon,
  BiometriaIcon,
  CatarataIcon,
  PterigioIcon,
  YagLaserIcon,
  IridotomiaIcon,
} from "./ProcedureIcons";

type Category = "all" | "exames" | "cirurgias" | "laser";

const ProceduresSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const procedures = [
    {
      icon: RetinografiaIcon,
      title: "Retinografia",
      description:
        "Fotografia detalhada do fundo do olho. Essencial para acompanhar diabetes, glaucoma e doenças da retina.",
      category: "exames" as const,
    },
    {
      icon: MapeamentoRetinaIcon,
      title: "Mapeamento de Retina",
      description:
        "Avaliação completa da retina para detectar problemas antes que afetem sua visão.",
      category: "exames" as const,
    },
    {
      icon: TonometriaIcon,
      title: "Tonometria",
      description:
        "Mede a pressão do olho — o principal exame para prevenir e controlar o glaucoma.",
      category: "exames" as const,
    },
    {
      icon: GonioscopiaIcon,
      title: "Gonioscopia",
      description:
        "Examina a drenagem interna do olho para avaliar o risco de glaucoma.",
      category: "exames" as const,
    },
    {
      icon: BiometriaIcon,
      title: "Biometria Ultrassônica",
      description:
        "Calcula o grau exato da lente que será implantada na cirurgia de catarata.",
      category: "exames" as const,
    },
    {
      icon: CatarataIcon,
      title: "Cirurgia de Catarata",
      description:
        "Troca do cristalino opaco por uma lente artificial. Procedimento rápido, seguro e que pode até reduzir a dependência de óculos.",
      category: "cirurgias" as const,
    },
    {
      icon: PterigioIcon,
      title: "Cirurgia de Pterígio",
      description:
        "Remove a membrana que cresce sobre o olho, causando irritação e vermelhidão. Técnica com baixo índice de retorno.",
      category: "cirurgias" as const,
    },
    {
      icon: YagLaserIcon,
      title: "YAG Laser",
      description:
        "Procedimento rápido (poucos minutos) para limpar a lente quando ela fica embaçada após cirurgia de catarata.",
      category: "laser" as const,
    },
    {
      icon: IridotomiaIcon,
      title: "Iridotomia a Laser",
      description:
        "Laser preventivo para pacientes com risco de glaucoma agudo. Indolor e feito no consultório.",
      category: "laser" as const,
    },
  ];

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "exames", label: "Exames" },
    { key: "cirurgias", label: "Cirurgias" },
    { key: "laser", label: "Laser" },
  ];

  const filtered =
    activeCategory === "all"
      ? procedures
      : procedures.filter((p) => p.category === activeCategory);

  const categoryLabel = (c: Category) =>
    c === "exames" ? "Exame" : c === "cirurgias" ? "Cirurgia" : "Laser";

  return (
    <section
      id="procedimentos"
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
            <span className="section-number">03</span>
            <span className="kicker">Procedimentos</span>
          </div>
          <span className="kicker-muted hidden sm:inline">O que tratamos</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          {/* Left: manifesto */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h2 className="mb-8 text-[clamp(2rem,3.8vw,3.25rem)] leading-[0.95] tracking-[-0.025em] text-foreground">
              Exames, cirurgias{" "}
              <span className="display-italic text-ochre">e laser.</span>
            </h2>

            <p className="mb-10 text-base leading-[1.7] text-muted-foreground">
              Diagnóstico completo e tratamento no mesmo lugar. Nove
              procedimentos, organizados por tipo de atendimento.
            </p>

            <div className="flex flex-col gap-0 border-y border-border">
              {categories.map((cat) => {
                const active = activeCategory === cat.key;
                const count =
                  cat.key === "all"
                    ? procedures.length
                    : procedures.filter((p) => p.category === cat.key).length;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`group flex items-baseline justify-between border-b border-border/60 py-4 text-left transition-colors last:border-b-0 ${
                      active
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-baseline gap-3">
                      <span
                        className={`font-serif text-xs italic ${
                          active ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {active ? "→" : "·"}
                      </span>
                      <span className="font-serif text-lg">{cat.label}</span>
                    </span>
                    <span className="caption tabular-nums">
                      {count.toString().padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: procedure entries — editorial index */}
          <div className="divide-y divide-border border-y border-border">
            {filtered.map((procedure, index) => (
              <article
                key={procedure.title}
                className={`group grid grid-cols-[auto_1fr_auto] items-start gap-5 py-7 transition-all duration-500 sm:gap-8 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
                }}
              >
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center border border-border bg-card transition-colors group-hover:border-primary/50">
                  <procedure.icon className="h-8 w-8 text-primary" />
                </div>

                <div>
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="font-serif text-xs italic text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-xl leading-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                      {procedure.title}
                    </h3>
                  </div>
                  <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
                    {procedure.description}
                  </p>
                </div>

                <span className="caption whitespace-nowrap uppercase tracking-[0.2em]">
                  {categoryLabel(procedure.category)}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProceduresSection;
