import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Phone, Clock } from "lucide-react";
import { useGoogleTag } from "@/hooks/useGoogleTag";
import { useMetaPixel } from "@/hooks/useMetaPixel";

import logoBradesco from "@/assets/convenios/bradesco-saude.png";
import logoSulamerica from "@/assets/convenios/sulamerica.png";
import logoUnimed from "@/assets/convenios/unimed.png";
import logoCassi from "@/assets/convenios/cassi.png";
import logoSaudeCaixa from "@/assets/convenios/saude-caixa.png";
import logoParticular from "@/assets/convenios/particular.png";

interface InsuranceSectionProps {
  onScheduleClick: () => void;
}

const InsuranceSection = ({ onScheduleClick }: InsuranceSectionProps) => {
  const { trackCTAClick, trackWhatsAppClick } = useGoogleTag();
  const { trackContact: trackMetaContact } = useMetaPixel();
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

  const insurances = [
    { name: "Particular", logo: logoParticular },
    { name: "Bradesco Saúde", logo: logoBradesco },
    { name: "Unimed", logo: logoUnimed },
    { name: "Cassi", logo: logoCassi },
    { name: "Sul América", logo: logoSulamerica },
    { name: "Saúde Caixa", logo: logoSaudeCaixa },
  ];

  return (
    <section
      id="convenios"
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
            <span className="section-number">06</span>
            <span className="kicker">Convênios</span>
          </div>
          <span className="kicker-muted hidden sm:inline">
            Cobertura & particular
          </span>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          {/* Manifesto */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h2 className="mb-8 text-[clamp(2rem,3.8vw,3.25rem)] leading-[0.95] tracking-[-0.025em] text-foreground">
              Seu convênio{" "}
              <span className="display-italic text-ochre">
                pode estar aqui.
              </span>
            </h2>

            <p className="mb-8 text-base leading-[1.7] text-muted-foreground">
              Trabalhamos com os convênios mais usados na região. Não encontrou
              o seu? Atendemos particular com valores acessíveis — sem
              surpresas, sem cobrança de consulta de retorno por 30 dias.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  trackCTAClick("agendar_consulta", "convenios", "Agendar");
                  onScheduleClick();
                }}
                className="gap-2"
              >
                <CalendarCheck aria-hidden="true" className="h-4 w-4" />
                Agendar consulta
              </Button>
              <a
                href="https://wa.me/5591936180476?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta%20com%20o%20Dr.%20Juliano%20Machado."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackWhatsAppClick();
                  trackMetaContact("WhatsApp");
                }}
              >
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>

            <div className="mt-10 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:gap-6">
              <span className="flex items-baseline gap-2">
                <Clock aria-hidden="true" className="h-3 w-3 text-primary" />
                Resposta em até 2h úteis
              </span>
              <span className="flex items-baseline gap-2">
                <CalendarCheck
                  aria-hidden="true"
                  className="h-3 w-3 text-primary"
                />
                Cancele quando quiser
              </span>
            </div>
          </div>

          {/* Insurance list — editorial index */}
          <div className="border-y border-border">
            {insurances.map((insurance, index) => (
              <div
                key={insurance.name}
                className={`flex items-center justify-between border-b border-border/60 py-5 last:border-b-0 transition-all duration-500 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 60}ms` : "0ms",
                }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-xs italic text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-lg text-foreground md:text-xl">
                    {insurance.name}
                  </span>
                </div>
                <img
                  src={insurance.logo}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="h-6 w-auto object-contain opacity-70 grayscale transition-opacity hover:opacity-100 hover:grayscale-0 sm:h-8"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceSection;
