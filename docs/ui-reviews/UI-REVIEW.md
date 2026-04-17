# Premium Medical Landing — UI Review

**Audited:** 2026-04-17
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md — standalone/non-GSD project)
**Screenshots:** Not captured (code-only audit, no dev server)
**Scope:** Landing page, booking flow entry, thank-you page, auth — sampled admin and shadcn UI primitives
**Project:** Ophthalmology landing page (PT-BR) for Dr. Juliano Machado — Paragominas/Belém, Brazil

---

## Overall Score: 18 / 24

This is a well-above-average Lovable-generated landing page that has been clearly refined beyond its starter template. The design system is cohesive, committed, and context-aware: a dark navy-and-gold palette with a teal secondary accent, a distinctive serif (Fraunces) paired with a characterful sans (Plus Jakarta Sans), and carefully composed hero / about / procedures sections with bespoke SVG iconography, noise overlays, and layered depth. Portuguese copywriting is warm and professional — no generic "Submit/Click Here" tells on the public surface. The main weaknesses are (1) the public-facing `/obrigado` page abandons the entire design system and uses hardcoded GitHub-dark colors, (2) the `/404` page is in English with a generic "Oops!" string, (3) accessibility: several interactive SVGs and decorative blocks lack aria attributes and the site is hard-locked to dark mode with no respect for user preference, and (4) the admin surface mixes multiple unrelated color systems (raw Tailwind slate/blue/green/amber scales) that conflict with the token-based landing palette.

---

## Pillar 1 — Copywriting (3 / 4)

### Findings

- **Strong, warm, medical-appropriate voice across public pages.** Hero H1 "Enxergar bem muda tudo" (`src/components/HeroSection.tsx:92-95`) is memorable, emotionally specific, and earns the gold gradient applied to the second line. Sub-copy names the doctor, the patient count, and the two cities in one sentence — excellent specificity.
- **CTAs are verb-led and contextual.** "Agendar consulta" (`src/components/HeroSection.tsx:116`), "Ver procedimentos" (`src/components/HeroSection.tsx:128`), "Falar no WhatsApp" (`src/components/InsuranceSection.tsx:129`), "Fale conosco" (`src/components/WhatsAppButton.tsx:55`). No generic "Submit" or "Click Here" on landing — the only `Submit` hits are internal `onSubmit` handlers, which is correct.
- **Empty and loading states are handled on the admin surface**, e.g. `"Nenhum paciente encontrado para esta data."` (`src/pages/admin/Avaliacoes.tsx:2152`), `"Nenhum profissional encontrado"` (`src/pages/admin/Profissionais.tsx:136`), `"Nenhuma data especial configurada"` (`src/pages/admin/Disponibilidade.tsx:550`). But `TestimonialsSection.tsx:178` only says `"As avaliações estão sendo carregadas."` for the empty state — the same message covers "still loading" and "fetch returned zero", which is misleading.
- **404 page is in English and uses the classic AI-slop "Oops!" string** (`src/pages/NotFound.tsx:15`: `<p>Oops! Page not found</p>`) — the rest of the site is pt-BR. Inconsistent voice, breaks brand trust the moment someone mistypes a URL.
- **Auth error message leak.** `src/pages/Auth.tsx:66-68` shows raw Supabase error messages to end users when it is not the known `"Invalid login credentials"` case. A PT-BR fallback should wrap unknown errors.
- **"Agendamento Enviado!" vs "Agendamento Confirmado!"** — `src/pages/Agendar.tsx:294` uses "Enviado" for the inline success state but `/obrigado` (`src/pages/Obrigado.tsx:69`) says "Confirmado". For a medical service where the appointment is NOT auto-confirmed (humans call back), "Enviado" / "Solicitado" is the accurate word everywhere and "Confirmado" is misleading — the footer itself says "Nossa equipe entrará em contato para confirmar" (`Obrigado.tsx:81`).

### Concrete Fixes

1. Translate `NotFound.tsx` to PT-BR, keep the brand voice ("Esta página saiu do campo de visão" is on-theme for an eye clinic), and match the Obrigado gradient so the 404 doesn't look like a different website.
2. Split `TestimonialsSection.tsx` empty state into (a) genuine loading skeleton (already handled at line 170) and (b) a distinct zero-results message like "Ainda não há avaliações para exibir." so "carregadas" doesn't mean two things.
3. Change "Agendamento Confirmado!" in `Obrigado.tsx:69` to "Solicitação recebida!" to match the actual flow — confirmations only happen after WhatsApp contact.
4. Add a PT-BR fallback for unknown auth errors at `Auth.tsx:67` so admins don't see raw Supabase strings in production.

---

## Pillar 2 — Visuals (3 / 4)

### Findings

- **Hero has a real visual point-of-view.** Asymmetric 2fr/3fr grid (`HeroSection.tsx:50`), a photo with an unusual `rounded-[2rem] rounded-bl-[4rem]` blob-corner frame, decorative concentric iris circles, a diagonal grid at `opacity-0.015`, and a gold radial glow. This is meaningfully more designed than a default Lovable hero and the iris-circle motif carries through to the Locations topographic rings and Footer SVG.
- **Bespoke SVG iconography for procedures.** `src/components/ProcedureIcons.tsx` contains 9 hand-authored SVG icons (Retinografia, Tonometria, etc.) using the palette tokens — not Lucide stock icons. This is a genuine differentiator for a landing page in this price tier.
- **Clear focal point on every section.** Each section has one headline with a gradient-text span, one primary CTA (or one interactive element like the location picker), and supporting content. No section competes with itself.
- **Icon-only buttons are inconsistently labeled.** Only 11 `aria-label` occurrences across all components; I found proper labels on `WhatsAppButton.tsx:52`, `Header.tsx:136, 149`, `Footer.tsx:140, 150`, `HeroSection.tsx:168` — but icon-only triggers like the Auth password toggle (`Auth.tsx:217-225, 270-278`) have no `aria-label`, and the Testimonials "Ler avaliações" link's `ArrowRight` decorative icon has no `aria-hidden`.
- **Decorative content leaks into the accessibility tree.** `TestimonialsSection.tsx:140-142` giant Quote SVG, `LocationsSection.tsx:75-80` topographic rings, `Footer.tsx:125-129` concentric circles, `AboutSection.tsx:39-41` iris circles — all missing `aria-hidden="true"`. Screen readers will announce "graphic" noise.
- **Iframe map has correct `title`** (`LocationsSection.tsx:162`) and `loading="lazy"` — good.
- **Hero photo has real alt text** (`HeroSection.tsx:65`: "Dr. Juliano Machado - Médico Oftalmologista") — good.

### Concrete Fixes

1. Add `aria-hidden="true"` to all decorative SVGs and background rings (`TestimonialsSection.tsx:140`, `LocationsSection.tsx:75-80`, `Footer.tsx:125-129`, `AboutSection.tsx:39-41`, decorative `ChevronDown` and `ArrowRight` where paired with text).
2. Add `aria-label="Mostrar senha"` / `"Ocultar senha"` (switchable) to the Auth password-toggle buttons (`Auth.tsx:217-225, 270-278`).
3. The "Avaliação verificada do Google" footer on testimonial cards (`TestimonialsSection.tsx:238-241`) is load-bearing trust signal — already good. But make sure the `GoogleIcon` is rendered with `role="img"` and an `aria-label="Google"` somewhere in the DOM, since it currently has no accessible name.

---

## Pillar 3 — Color (3 / 4)

### Findings

- **Committed, distinctive palette with clear 60/30/10 discipline.** The design is Navy 60 / Gold 30 / Teal 10, defined via HSL CSS variables in `src/index.css:9-61`. This deliberately rejects the "purple gradient on white" AI cliché, and the gold-on-navy is executed consistently across Header, Hero, About, Procedures, Insurance, Locations, Footer.
- **Accent color discipline is very good.** I counted ~180 primary-related utility hits across 30 files. Crucially, the *teal* `accent` is used sparingly and meaningfully — as the "Belém city" distinguisher in `LocationsSection.tsx:104, 131`, the credentials-chip background `AboutSection.tsx:84`, the secondary decorative iris ring on icons (`ProcedureIcons.tsx` throughout). This is correct "10% color" behavior.
- **Hardcoded hex colors are mostly justified.** `#25D366` / `#20BD5A` for WhatsApp (`button.tsx:19`, `WhatsAppButton.tsx:49`), Google brand colors in the Google G-icon (`HeroSection.tsx:146-149`, `TestimonialsSection.tsx:127-130`). Brand colors shouldn't be tokenized — these are fine.
- **`/obrigado` page abandons the entire design system.** `src/pages/Obrigado.tsx:59` uses hardcoded `#0d1117 → #161b22` (literal GitHub dark palette), `#58a6ff` (GitHub link blue) at line 67, `#1c2128` at line 77, and `text-gray-*` / `text-green-400` at lines 72, 79, 85, 91, 110, 114, 115. This is the single biggest design-system violation in the entire project — it looks like a page from a different website and abandons the gold/navy/Fraunces identity at the exact moment the user has just converted.
- **Admin layer uses raw Tailwind color scales that bypass the token system.** `src/components/admin/AgendaSlot.tsx:18, 44-47, 123, 171` — `bg-gray-100`, `bg-green-50`, `bg-blue-50`, `text-blue-600`, `text-green-400` etc. `src/components/admin/AgendamentosTable.tsx:21` — `bg-blue-100 text-blue-800`. `src/pages/admin/Dashboard.tsx:55-57` — raw hex arrays for recharts. The status color system in `AgendaSlot.tsx:15-40` reinvents a red/amber/emerald semantic layer without using `--destructive` / the gold primary. This creates two parallel color systems.
- **Tailwind `components.json` declares `baseColor: "slate"`** (`components.json:9`) but the actual palette uses navy-tinted neutrals (`hsl(222 42% ...)`). Mismatch is cosmetic-only but could mislead a future `npx shadcn add` call.

### Concrete Fixes

1. **Rewrite `/obrigado` to use the design tokens.** Replace the inline `style` gradient with `className="min-h-screen hero-gradient noise-overlay"`, `text-gray-300` → `text-muted-foreground`, `text-green-400` → `text-primary` (or keep green as a true success token by adding `--success` to `index.css`), `#58a6ff` → `text-primary` with the gradient-text utility. This is the highest-ROI fix in the entire audit.
2. Add a semantic `--success` CSS variable (currently green is only used on the 404/Obrigado/AgendaSlot pages and is untokenized) and migrate `text-green-*` / `bg-green-*` usage to it.
3. Unify the admin slot-status palette with the design tokens. `bg-gray-100 dark:bg-gray-800/50` → `bg-muted`, `bg-red-*` blocked states → `bg-destructive/10 text-destructive`, etc.

---

## Pillar 4 — Typography (3 / 4)

### Findings

- **Distinctive font pairing that rejects the AI cliché.** `Fraunces` (variable serif with optical size axis, declared at `index.css:5` and applied to h1/h2/h3 at `index.css:81-88` including `font-variation-settings: 'opsz' 72` on h1) + `Plus Jakarta Sans` body. Fraunces with a high optical-size axis reads as editorial/premium and is exactly right for a private-practice medical brand. This is a genuine differentiator vs the Inter-everywhere default.
- **Hierarchy is present and obeyed.** Hero h1 at `text-[4rem]` / `font-extrabold` / `tracking-[-0.02em]` / `leading-[1.08]` (`HeroSection.tsx:91`), section h2s at `text-[2.75rem]` / `font-bold`, body copy at `text-base`/`lg` with `leading-relaxed`. Small labels use `uppercase tracking-[0.08em]` or `tracking-[0.2em]` for micro-typography (`HeroSection.tsx:85, 170`) — this is nuanced and correct.
- **Font-size scale is wide but mostly intentional.** Tailwind classes in use span `text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-5xl, text-6xl` plus arbitrary `text-[10px]`, `text-[11px]`, `text-[2.75rem]`, `text-[4rem]`. 10 + 4 = 14 distinct sizes is on the high end for a single-page marketing site. Some consolidation is warranted (e.g., `text-[10px]` on three admin files could snap to `text-xs`).
- **Headings inconsistently honor the `font-serif` body default.** The global rule at `index.css:81-84` sets `h1, h2, h3` to Fraunces automatically, but many components also write `font-serif` explicitly (`Agendar.tsx:279, 293`, `Obrigado.tsx:66`) — redundant, not broken. More concerning: several important headings are rendered inside `<span>` or `<h4>` / `<div>` elements with `font-sans` overrides (`AboutSection.tsx:112, 124`, `ProceduresSection.tsx:115`, `LocationsSection.tsx:127, 169`, `Footer.tsx:39, 62, 85`) — these force Plus Jakarta on sub-heads that could elegantly use Fraunces at smaller weights. The intent seems to be "serif for headlines, sans for UI labels," which is a valid rule, but it's applied unevenly.
- **Font weight inventory is controlled**: `font-medium, font-semibold, font-bold, font-extrabold`. Only four weights across the landing — disciplined.
- **Body line-height discipline.** `leading-relaxed` on paragraphs, `leading-[1.08]` / `leading-[1.15]` on large heads — good.

### Concrete Fixes

1. Pick one rule: "Fraunces = h1/h2 only, `font-sans` for h3/h4/card-titles" or "Fraunces on all headlines including card titles." Document it in a comment in `index.css` and remove redundant `font-serif` / `font-sans` overrides.
2. Consolidate `text-[10px]` usage in admin (`WhatsAppLeadItem.tsx:75, 88, 96`, `WhatsAppMessageBubble.tsx:63`) to `text-xs` unless the design truly needs 10px specifically — tiny arbitrary values make the scale feel undisciplined.
3. Add `font-display-swap` hint via `<link rel="preload">` for the Fraunces .woff2 in `index.html` to avoid FOIT on first paint (the variable font is large).

---

## Pillar 5 — Spacing (3 / 4)

### Findings

- **Consistent vertical rhythm across public sections.** Every public section uses `py-20 md:py-28` (About, Procedures, Insurance, Locations, Testimonials) — that's a clean 80px → 112px responsive step. Hero uses a custom `min-h-[75dvh]` which is correct for a hero. `container mx-auto px-4` is used everywhere for horizontal gutters.
- **Spacing scale discipline is strong.** ~200 `p-*` / `py-*` / `gap-*` hits across 20 files, and the numeric values cluster around the standard 2/3/4/5/6/8/10/12 scale. Arbitrary-value spacing is rare and justified (`max-w-[220px]` for the credentials card, `min-h-[500px]` for the map frame, `max-h-[28rem]` for the mobile menu — each solves a concrete layout problem).
- **Card padding system is stable.** `p-5 md:p-6 md:p-8` in the Agendar form card (`Agendar.tsx:304`), consistent `p-6` in shadcn CardHeader/CardContent/CardFooter (`src/components/ui/card.tsx:12, 32, 38`), `p-5 pb-4 pt-8` inside procedure cards. No arbitrary pixel values for padding that I could find in the landing sections.
- **Grid gap choices match the aesthetic.** Procedures grid `gap-5` (`ProceduresSection.tsx:89`), Insurance grid `gap-3 md:gap-4` (`InsuranceSection.tsx:65`), Hero 2-col `gap-8 lg:gap-14` (`HeroSection.tsx:50`) — all read as deliberate.
- **One asymmetric overlap technique is used to good effect.** `AboutSection.tsx:46` — photo column with `lg:-mr-16` and credentials card `absolute -bottom-6 -right-6 md:-right-12` creating intentional overlap with the content column. This is a grid-breaking move that elevates the design above generic Lovable.
- **Minor inconsistencies.** Hero stats cards use `px-3 py-3 rounded-xl` (`HeroSection.tsx:188`) while neighbor trust-badge uses `px-3.5 py-1.5 rounded-full` (line 83) — the half-step 3.5 breaks the scale for no functional reason. Also `mb-6` vs `mb-8` vs `mb-10` alternate somewhat arbitrarily across the AboutSection paragraphs (`AboutSection.tsx:91, 97, 101`).

### Concrete Fixes

1. Round `px-3.5 py-1.5` (`HeroSection.tsx:83`, `HeroSection.tsx:108` similar badge patterns) to `px-3 py-1.5` or `px-4 py-2` to keep the scale on integer half-steps.
2. Standardize heading-to-paragraph spacing in `AboutSection.tsx` — currently `mb-6` after h2, `mb-5` after first paragraph, `mb-10` after second paragraph. Pick a rhythm: e.g., `mb-6` after heading, `mb-5` between body paragraphs, `mb-10` before the feature grid.
3. Consider extracting `py-20 md:py-28` into a `.section-padding` utility in `index.css @layer components` so future sections don't drift.

---

## Pillar 6 — Experience Design (3 / 4)

### Findings

- **Loading states are present at every async boundary.** `ConsultationDetailsStep.tsx:82-88` — proper centered Loader2 spinner while taxonomy loads. `TestimonialsSection.tsx:169-173` — spinner while Google reviews load. `Auth.tsx:229, 294` — button-embedded spinner when login/signup is in-flight. `Agendar.tsx:340` — `isSubmitting` prop threaded into ConfirmationStep.
- **Disabled state discipline is present.** Every `<Input disabled={isLoading}>` in Auth, the "Avançar" button validates before advancing (`PersonalDataStep.tsx:50-54`), `AlertDialogCancel disabled={deleting}` (`src/pages/admin/Agendamentos.tsx:207`).
- **Error handling uses a consistent toast pattern.** `toast({title, description, variant: "destructive"})` recurs ~20+ times. The Agendar flow even parses specific availability errors and auto-rewinds to step 3 (`Agendar.tsx:135-149`) — genuinely thoughtful UX.
- **Success state is celebratory and contextual.** `SuccessStep.tsx` uses a bespoke `<Confetti />` component, Sparkles micro-animations at staggered delays, a double-layered primary gradient ring around the CheckCircle. This is real effort.
- **No `ErrorBoundary` is declared anywhere.** `grep -i "ErrorBoundary"` returns zero hits. A single uncaught render error will white-screen the whole SPA — unacceptable for a booking page.
- **Dark-mode is hard-locked; no respect for `prefers-color-scheme`.** `index.html:8-9` declares `theme-color: #0d1117` and `color-scheme: dark`. `tailwind.config.ts:4` says `darkMode: ["class"]`. `next-themes` is installed but I see no provider mounting it. Users in bright outdoor environments (medical patients! often elderly!) cannot opt into a light theme.
- **Focus states are defined globally** (`index.css:91-93` — `:focus-visible { @apply outline-2 outline-offset-2 outline-primary }`) — good.
- **Form validation is synchronous and inline** (`PersonalDataStep.tsx:33-48`) — proper error messages under each field in PT-BR.
- **Keyboard navigation on the location picker is incomplete.** `LocationsSection.tsx:107` uses `<button>` so it's keyboard-reachable, but the 4-item list doesn't support arrow-key navigation (would be expected for a tablist-like UI). Not critical, but noted.
- **The Helmet tags are a tiny positive.** `Index.tsx:54-73`, `Agendar.tsx:259-265`, `Obrigado.tsx:49-55` all declare title + description + (where applicable) JSON-LD. Good experience for search → first-paint → social preview.

### Concrete Fixes

1. **Add a top-level `<ErrorBoundary>` in `App.tsx`** around the route outlet with a themed fallback ("Algo deu errado — tente recarregar a página").
2. **Respect `prefers-color-scheme`.** Wire `next-themes` (already in `package.json:52`) into a ThemeProvider at the app root, change `darkMode: ["class"]` behavior to respect the OS preference for the initial paint, and provide a toggle in the Header. Medical patients skew older and may have low-vision needs where light mode is essential.
3. Add a visible "Saltar para conteúdo" (skip-to-main) link at the start of `<body>` for keyboard users, since the Header is fixed and tall.
4. Upgrade `LocationsSection` to role="tablist" with arrow-key navigation, so the 4-location picker becomes a real WAI-ARIA tab pattern.

---

## Top 3 Priority Fixes

1. **Rewrite `/obrigado` to use the design tokens.** Impact: HIGH (it's the page seen by every converter — the one that sets post-booking emotional tone). Effort: LOW (~15 min). Replace lines 59, 67, 72, 77, 79-92, 110, 114-115 in `src/pages/Obrigado.tsx` — swap hardcoded hex (`#0d1117`, `#58a6ff`, `#1c2128`) for the `hero-gradient`, `gradient-text`, and `text-muted-foreground` / `text-foreground` tokens; swap `text-green-400` for either `text-primary` or a new `--success` variable. Remove the `text-gray-*` scale entirely.
2. **Translate and redesign `NotFound.tsx`** (`src/pages/NotFound.tsx`). Impact: MEDIUM (breaks brand trust on mistyped URLs, gets crawled by bots). Effort: LOW (~10 min). Translate "Oops! Page not found" → "Esta página saiu do seu campo de visão", apply `hero-gradient` + `font-serif` headline + `Button variant="hero"` CTA "Voltar ao início", match the rest of the site.
3. **Add `ErrorBoundary` and theme-respect.** Impact: HIGH (a single render crash currently white-screens booking). Effort: MEDIUM (~30 min). Wrap the Router outlet in `src/App.tsx` with a themed `<ErrorBoundary>` and mount `next-themes`'s `<ThemeProvider>` respecting `prefers-color-scheme` — give the Header a subtle sun/moon toggle.

---

## Design System Inventory

### Colors (from `tailwind.config.ts` + `src/index.css`)

| Token | Value | Purpose |
|-------|-------|---------|
| `--background` | `hsl(222 42% 6%)` | Near-black navy, app bg |
| `--foreground` | `hsl(40 15% 95%)` | Warm off-white body text |
| `--primary` | `hsl(42 85% 54%)` | Warm gold — CTAs, accents, highlights (30% usage) |
| `--accent` | `hsl(175 60% 42%)` | Teal — Belém tag, minor decoration (10% usage) |
| `--card` | `hsl(222 42% 9%)` | Elevated surfaces |
| `--muted` | `hsl(222 35% 13%)` | Sunken surfaces, subtle text |
| `--destructive` | `hsl(0 80% 58%)` | Error toasts |
| `gold.*` | 50-900 scale | Hero gradient button |
| `navy.*` | 50-900 scale | Rarely referenced directly; `--background`/`--card` override |
| Gradient tokens | `--gradient-primary/hero/card/gold/accent` | Reused in `hero-gradient`, `gradient-text`, `card-premium` utilities |
| Shadow tokens | `--shadow-glow/card/gold/accent` | Elevation and atmosphere |

**Palette quality:** disciplined 60/30/10 navy/gold/teal. Strong commitment to dark-only, warm-biased neutrals (navy + warm gold rather than cold slate + electric accent — a deliberate choice that reads as premium rather than techy).

### Fonts (from `index.css:5, 81-88` + `tailwind.config.ts:16-19`)

- **Display:** `"Fraunces"` variable serif with `opsz` axis (400-800 weights, 9-144 optical size), applied to `h1, h2, h3` automatically. H1 uses `font-variation-settings: 'opsz' 72` for display optical size.
- **Body:** `"Plus Jakarta Sans"` 400/500/600/700.
- Both loaded via Google Fonts with `preconnect` in `index.html:35-36`. FOIT mitigation could be improved with `rel="preload"`.

### Spacing scale

Standard Tailwind (4px base). Integer half-steps used occasionally (`px-3.5`, `gap-2.5`) — mostly disciplined. `container padding: 1.5rem` (`tailwind.config.ts:10`), max `2xl: 1280px` (line 12). Arbitrary values rare and justified.

### Radii

`--radius: 0.75rem` (12px), with `sm`/`md`/`lg` derived. `rounded-xl`, `rounded-2xl`, `rounded-3xl` used heavily for card hierarchy. Creative bloblet corners (`rounded-[2rem] rounded-bl-[4rem]`) on the hero portrait.

### Animation library

- Custom keyframes: `fade-in, slide-up, slide-right, slide-left, scale-in, blur-in, reveal-up, shimmer, glow, whatsapp-pulse, pulse-glow, confetti-fall`. All declared in `index.css:264-395`.
- Animation-delay utilities `animation-delay-100` through `animation-delay-1000` (`index.css:252-261`) — used for staggered reveals on Hero stats/CTAs.
- Timing curves: `ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) used throughout — creates the "refined" feel.
- No Framer Motion / Motion One. All CSS-driven. Appropriate for the refined-minimal direction.

### Component libraries

- **shadcn/ui** (`components.json`): 47 primitives in `src/components/ui/`. `baseColor` declared as `slate` (cosmetic mismatch — actual palette is navy-biased). Customizations: `Button` variants `hero`, `whatsapp`, `premium` (`button.tsx:18-20`) — genuine project-specific extensions.
- **Radix UI** primitives (27 packages in `package.json`).
- **Lucide React** for iconography (not on the critical public surface — custom SVG wins there).
- **Recharts** for admin dashboard charts.
- **react-helmet-async** for page-level SEO/meta.
- **date-fns** + `react-day-picker` for the booking calendar.
- **sonner** + shadcn `Toaster` for toast notifications.

### Utility classes (bespoke)

`gradient-text`, `gradient-text-accent`, `card-glass`, `card-premium`, `card-shimmer`, `glow-effect`, `glow-gold`, `hero-gradient`, `noise-texture`, `noise-overlay`, `border-gold`, `text-gold`, `ease-out-expo`, plus 10 animation utilities. Defined in `index.css:102-195, 197-262`. Good component-layer discipline; most could move into a shared `styles/` file.

---

## Files Audited

**Tokens & config:**
- `tailwind.config.ts`
- `src/index.css`
- `components.json`
- `package.json`
- `index.html`
- `frontend-design.md`

**Pages:**
- `src/pages/Index.tsx`
- `src/pages/Agendar.tsx`
- `src/pages/Obrigado.tsx`
- `src/pages/Auth.tsx`
- `src/pages/NotFound.tsx`

**Landing components:**
- `src/components/Header.tsx`
- `src/components/HeroSection.tsx`
- `src/components/AboutSection.tsx`
- `src/components/ProceduresSection.tsx`
- `src/components/InsuranceSection.tsx`
- `src/components/LocationsSection.tsx`
- `src/components/TestimonialsSection.tsx`
- `src/components/Footer.tsx`
- `src/components/WhatsAppButton.tsx`
- `src/components/ProcedureIcons.tsx`

**Sampled scheduling components:**
- `src/components/scheduling/SchedulingModal.tsx`
- `src/components/scheduling/PersonalDataStep.tsx`
- `src/components/scheduling/ConsultationDetailsStep.tsx`
- `src/components/scheduling/SuccessStep.tsx`

**Sampled UI primitives:**
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`

**Sampled admin components:**
- `src/components/admin/AgendaSlot.tsx` (first 50 lines)

Audit completed using file reads and ripgrep-based token/class audits. No dev server was running; no screenshots were captured.
