import { Instagram, MessageCircle } from "lucide-react";
import { useGoogleTag } from "@/hooks/useGoogleTag";
import { useMetaPixel } from "@/hooks/useMetaPixel";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { trackWhatsAppClick } = useGoogleTag();
  const { trackContact: trackMetaContact } = useMetaPixel();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="paper-grain relative border-t border-border bg-background">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        {/* Masthead */}
        <div className="mb-12 flex items-baseline justify-between border-b border-border pb-6">
          <div className="flex items-baseline gap-4">
            <span className="section-number">fim</span>
            <span className="kicker">Colofão</span>
          </div>
          <span className="kicker-muted tabular-nums">{currentYear}</span>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <h3 className="mb-4 font-serif text-3xl leading-none tracking-tight text-foreground">
              Juliano Machado
            </h3>
            <p className="mb-5 font-serif text-base italic text-ochre">
              Oftalmologista
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Consultas, exames e cirurgias em Paragominas e Belém. Agendamento
              online em minutos.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="kicker mb-5">Seções</p>
            <nav className="flex flex-col gap-3 text-sm">
              {[
                { label: "Sobre", id: "sobre", num: "02" },
                { label: "Procedimentos", id: "procedimentos", num: "03" },
                { label: "Depoimentos", id: "depoimentos", num: "04" },
                { label: "Locais", id: "locais", num: "05" },
                { label: "Convênios", id: "convenios", num: "06" },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="group flex items-baseline gap-2 text-left text-foreground/80 transition-colors hover:text-primary"
                >
                  <span className="font-serif text-[0.65rem] italic text-muted-foreground">
                    {link.num}
                  </span>
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Locations */}
          <div>
            <p className="kicker mb-5">Endereços</p>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <span className="block font-serif text-base text-foreground">
                  Paragominas
                </span>
                Clinicor · Hospital Geral
              </li>
              <li>
                <span className="block font-serif text-base text-foreground">
                  Belém
                </span>
                Instituto de Olhos · Vitria Síntese 21
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="kicker mb-5">Contato</p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="https://wa.me/5591936180476"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackWhatsAppClick();
                  trackMetaContact("WhatsApp");
                }}
                className="link-editorial"
              >
                (91) 93618-0476
              </a>
              <a
                href="https://www.instagram.com/drjulianomachado.oftalmo/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-editorial"
              >
                @drjulianomachado.oftalmo
              </a>
            </div>
          </div>
        </div>

        {/* Rule */}
        <hr className="rule mt-16" />

        {/* Colophon */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {currentYear} Dr. Juliano Machado ·{" "}
            <span className="font-serif italic">CRM-PA</span> · Todos os
            direitos reservados
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/drjulianomachado.oftalmo/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
              aria-label="Instagram"
            >
              <Instagram aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/5591936180476"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackWhatsAppClick();
                trackMetaContact("WhatsApp");
              }}
              className="transition-colors hover:text-primary"
              aria-label="WhatsApp"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
