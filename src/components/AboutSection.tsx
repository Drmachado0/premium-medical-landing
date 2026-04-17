import { Heart, Cpu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import drJulianoPhoto from "@/assets/dr-juliano-consultorio.jpg";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      id="sobre"
      ref={sectionRef}
      className="paper-grain relative overflow-hidden py-24 md:py-32"
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
            <span className="section-number">02</span>
            <span className="kicker">Retrato</span>
          </div>
          <span className="kicker-muted hidden sm:inline">
            Sobre o médico
          </span>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          {/* Photo column — editorial portrait */}
          <figure
            className={`relative transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative overflow-hidden border border-border bg-card">
              <img
                src={drJulianoPhoto}
                alt="Dr. Juliano Machado em seu consultório"
                className="h-auto w-full object-cover grayscale-[0.2] contrast-[1.05]"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
              <span className="font-serif text-base italic text-foreground">
                No consultório, Paragominas
              </span>
              <span className="caption">Fig. 01</span>
            </figcaption>
          </figure>

          {/* Content column */}
          <div
            className={`transition-all delay-200 duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="mb-10 text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.95] tracking-[-0.025em]">
              <span className="block text-foreground">Do consultório</span>
              <span className="display-italic block text-ochre">
                à sala de cirurgia,
              </span>
              <span className="block text-foreground">sempre ao seu lado.</span>
            </h2>

            <hr className="rule mb-8" />

            <p className="dropcap mb-6 text-base leading-[1.7] text-foreground/85 md:text-lg">
              O Dr. Juliano é oftalmologista há mais de treze anos e atende em
              Paragominas e Belém. No consultório, ele é conhecido por{" "}
              <span className="font-serif italic text-foreground">
                explicar cada detalhe
              </span>{" "}
              com calma — porque acredita que um paciente bem informado faz
              melhores escolhas sobre sua saúde.
            </p>

            <p className="mb-12 text-base leading-[1.7] text-muted-foreground md:text-lg">
              Desde exames de rotina até cirurgias de catarata e pterígio, o
              foco é sempre o mesmo: resolver o problema com segurança e
              devolver a qualidade de visão que você merece.
            </p>

            {/* Credentials — editorial list */}
            <div className="mb-12 border-y border-border py-6">
              <p className="kicker mb-4">Credenciais</p>
              <ul className="grid gap-3 text-sm text-foreground/85 sm:grid-cols-2">
                <li className="flex items-baseline gap-2">
                  <span className="font-serif text-xs italic text-primary">
                    i.
                  </span>
                  Membro da Sociedade Brasileira de Oftalmologia
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="font-serif text-xs italic text-primary">
                    ii.
                  </span>
                  13+ anos de prática clínica
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="font-serif text-xs italic text-primary">
                    iii.
                  </span>
                  Explica cada passo ao paciente
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="font-serif text-xs italic text-primary">
                    iv.
                  </span>
                  Equipamentos de última geração
                </li>
              </ul>
            </div>

            {/* Features — editorial callouts */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <Heart
                  aria-hidden="true"
                  className="mb-3 h-5 w-5 text-primary"
                  strokeWidth={1.5}
                />
                <h3 className="mb-2 font-serif text-xl text-foreground">
                  Consulta sem pressa
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  O Dr. Juliano dedica o tempo necessário para ouvir, examinar
                  e explicar cada resultado com clareza.
                </p>
              </div>
              <div>
                <Cpu
                  aria-hidden="true"
                  className="mb-3 h-5 w-5 text-primary"
                  strokeWidth={1.5}
                />
                <h3 className="mb-2 font-serif text-xl text-foreground">
                  Equipamentos atualizados
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Retinógrafo digital, biometria ultrassônica e laser — tudo o
                  que você precisa em um só lugar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
