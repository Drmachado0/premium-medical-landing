import { MapPin, Phone, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useGoogleTag } from "@/hooks/useGoogleTag";

const LocationsSection = () => {
  const [activeLocation, setActiveLocation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { trackPhoneClick } = useGoogleTag();

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

  const locations = [
    {
      name: "Clinicor",
      city: "Paragominas",
      address: "R. Célio Miranda, 729 · Paragominas – PA",
      phone: "(91) 93618-0476",
      mapUrl:
        "https://www.openstreetmap.org/export/embed.html?bbox=-47.355%2C-2.998%2C-47.350%2C-2.993&layer=mapnik&marker=-2.9958%2C-47.3528",
      mapsLink:
        "https://maps.google.com/?q=Clinicor+Rua+Celio+Miranda+729+Paragominas+PA",
    },
    {
      name: "Hospital Geral de Paragominas",
      city: "Paragominas",
      address: "R. Santa Terezinha, 304 · Centro · Paragominas – PA",
      phone: "(91) 9100-0303",
      mapUrl:
        "https://www.openstreetmap.org/export/embed.html?bbox=-47.358%2C-2.995%2C-47.353%2C-2.990&layer=mapnik&marker=-2.9925%2C-47.3558",
      mapsLink:
        "https://maps.google.com/?q=Hospital+Geral+Paragominas+Santa+Terezinha+304",
    },
    {
      name: "Instituto de Olhos de Belém",
      city: "Belém",
      address: "Av. Generalíssimo Deodoro, 904 · Nazaré · Belém – PA",
      phone: "(91) 3239-4600",
      mapUrl:
        "https://www.openstreetmap.org/export/embed.html?bbox=-48.492%2C-1.458%2C-48.487%2C-1.453&layer=mapnik&marker=-1.4558%2C-48.4897",
      mapsLink:
        "https://maps.google.com/?q=Instituto+de+Olhos+de+Belem+Av+Generalissimo+Deodoro+904+Nazare+Belem+PA",
    },
    {
      name: "Vitria — Ed. Síntese 21",
      city: "Belém",
      address:
        "Av. Conselheiro Furtado, 2865, sobreloja · São Braz · Belém – PA",
      phone: "(91) 3342-1463",
      mapUrl:
        "https://www.openstreetmap.org/export/embed.html?bbox=-48.472%2C-1.438%2C-48.467%2C-1.433&layer=mapnik&marker=-1.4358%2C-48.4697",
      mapsLink:
        "https://maps.google.com/?q=Vitria+Ed+Sintese+21+Av+Conselheiro+Furtado+2865+Sao+Braz+Belem+PA",
    },
  ];

  const active = locations[activeLocation];

  return (
    <section
      id="locais"
      ref={sectionRef}
      className="paper-grain relative bg-secondary/30 py-24 md:py-32"
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
            <span className="section-number">05</span>
            <span className="kicker">Locais</span>
          </div>
          <span className="kicker-muted hidden sm:inline">
            Quatro endereços
          </span>
        </div>

        <div className="mb-12 max-w-2xl">
          <h2 className="mb-4 text-[clamp(2rem,3.8vw,3.25rem)] leading-[0.95] tracking-[-0.025em] text-foreground">
            Quatro endereços,{" "}
            <span className="display-italic text-ochre">
              um cuidado só.
            </span>
          </h2>
          <p className="text-base leading-[1.7] text-muted-foreground">
            Escolha o local mais perto de você. Todos com estrutura completa
            para consultas e procedimentos.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
          {/* Location list */}
          <div className="border-y border-border">
            {locations.map((location, index) => {
              const isActive = activeLocation === index;
              return (
                <button
                  key={location.name}
                  onClick={() => setActiveLocation(index)}
                  className={`flex w-full items-baseline justify-between border-b border-border/60 py-5 text-left transition-colors last:border-b-0 ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={`font-serif text-xs italic ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {isActive ? "→" : String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg md:text-xl">
                        {location.name}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {location.address}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`caption whitespace-nowrap uppercase tracking-[0.2em] ${
                      location.city === "Belém" ? "text-oxblood" : ""
                    }`}
                  >
                    {location.city}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Map + active details */}
          <div className="flex flex-col">
            <div className="relative h-[320px] border border-border bg-card sm:h-[420px]">
              <iframe
                key={active.name}
                src={active.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale-[0.3] contrast-[1.02]"
                title={`Mapa — ${active.name}`}
              />
            </div>

            <div className="mt-6 border-b border-border pb-5">
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="font-serif text-xl text-foreground md:text-2xl">
                  {active.name}
                </h3>
                <span className="caption uppercase tracking-[0.2em]">
                  {active.city}
                </span>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-baseline gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 translate-y-[2px] text-primary"
                  />
                  <span>{active.address}</span>
                </div>
                <a
                  href={`tel:${active.phone.replace(/\D/g, "")}`}
                  onClick={() =>
                    trackPhoneClick(`tel:${active.phone.replace(/\D/g, "")}`)
                  }
                  className="flex items-baseline gap-3 transition-colors hover:text-primary"
                >
                  <Phone
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 translate-y-[2px] text-primary"
                  />
                  <span>{active.phone}</span>
                </a>
              </div>

              <a
                href={active.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-baseline gap-2 link-editorial text-sm"
              >
                Ver no Google Maps
                <ExternalLink aria-hidden="true" className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
