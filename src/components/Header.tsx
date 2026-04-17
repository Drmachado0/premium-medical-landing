import { Menu, X, Settings, LogIn, CalendarCheck, Phone } from "lucide-react";
import { useGoogleTag } from "@/hooks/useGoogleTag";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onScheduleClick: () => void;
}

const navItems = [
  { label: "Sobre", id: "sobre", num: "02" },
  { label: "Procedimentos", id: "procedimentos", num: "03" },
  { label: "Depoimentos", id: "depoimentos", num: "04" },
  { label: "Locais", id: "locais", num: "05" },
  { label: "Convênios", id: "convenios", num: "06" },
];

const Header = ({ onScheduleClick: _onScheduleClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin } = useAuth();
  const { trackWhatsAppClick } = useGoogleTag();
  const { trackContact: trackMetaContact } = useMetaPixel();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/60 bg-background/92 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Logo — editorial masthead */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex shrink-0 items-baseline gap-3 text-left"
          >
            <span className="font-serif text-xl leading-none tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
              Juliano Machado
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" />
            <span className="kicker-muted hidden sm:inline">
              Oftalmologista
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group flex items-baseline gap-1.5 text-sm transition-colors ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <span className="font-serif text-[0.65rem] italic text-muted-foreground">
                  {item.num}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings aria-hidden="true" className="h-4 w-4" />
                  {isAdmin ? "Admin" : "Painel"}
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <LogIn aria-hidden="true" className="h-4 w-4" />
                  Entrar
                </Button>
              </Link>
            )}
            <Link to="/agendar">
              <Button variant="hero" size="sm" className="gap-2">
                <CalendarCheck aria-hidden="true" className="h-4 w-4" />
                Agendar
              </Button>
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <a
              href="https://wa.me/5591936180476"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackWhatsAppClick();
                trackMetaContact("WhatsApp");
              }}
              className="rounded-[2px] p-2 text-primary transition-colors hover:bg-primary/10"
              aria-label="WhatsApp"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
            </a>
            <Link to="/agendar">
              <Button variant="hero" size="sm" className="h-9 px-3 text-xs">
                Agendar
              </Button>
            </Link>
            <button
              className="rounded-[2px] p-2 text-foreground transition-colors hover:bg-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isMenuOpen
              ? "mt-4 max-h-[28rem] border-t border-border pt-4"
              : "max-h-0"
          }`}
        >
          <nav className="flex flex-col">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-baseline gap-3 border-b border-border/50 px-2 py-3 text-left text-sm transition-all ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground"
                } ${
                  isMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 40}ms` : "0ms",
                }}
              >
                <span className="font-serif text-xs italic text-muted-foreground">
                  {item.num}
                </span>
                <span className="font-serif text-lg">{item.label}</span>
              </button>
            ))}

            <div className="mt-3">
              {user ? (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Settings aria-hidden="true" className="h-4 w-4" />
                    {isAdmin ? "Admin" : "Painel"}
                  </Button>
                </Link>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <LogIn aria-hidden="true" className="h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
