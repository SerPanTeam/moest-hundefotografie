# Maren Möst · Hundefotografie — Fine-Art Noir (Hauptvariante)

Bespoke Fine-Art-Website auf tiefem Schwarz mit Original-Logo-Banner im Hero.
Reines **HTML + CSS + Vanilla JS**, ohne Framework und ohne Build-Step.
Gebaut als sauberes **CMS-Template** (Grav, WordPress-Theme oder Headless).

## Seiten

```
fineart/
├── index.html          Startseite (Banner-Hero, Leistungen, Portfolio, Stimmen)
├── portfolio.html      Galerie + Mensch & Hund
├── leistungen.html     3 Leistungs-Reihen + FAQ
├── preise.html         Investition (Preis-Karten) + FAQ
├── ueber-mich.html     Über Maren (echte Porträtfotos)
├── blog.html           Journal (Beitrags-Karten)
├── kontakt.html        Formular + Kontaktdaten + Karte
├── impressum.html      Rechtliches (echte Stammdaten)
├── datenschutz.html    Datenschutzerklärung (auf den aktuellen Stack abgestimmt)
├── index-print.html    Druck-/PDF-Variante der Startseite
├── css/
│   ├── styles.css      Gesamtes Design (Tokens, BEM, mobile-first)
│   └── fonts.css       Selbst gehostete Webfonts (woff2)
├── js/
│   ├── reveal.js       Fade-up beim Scrollen (IntersectionObserver)
│   └── main.js         Header-Scroll, Mobil-Menü, FAQ, Formular
└── images/             Banner, Logos (weiß/schwarz), Favicon, Fotos
```

## Design-Tokens (Theme über `:root` in `css/styles.css`)

| Token | Wert | Bedeutung |
|---|---|---|
| `--color-bg` | `#0c0b0a` | Tiefes Schwarz |
| `--color-bg-soft` | `#131211` | Abwechselnde Sektionen |
| `--color-ink` | `#ece6da` | Haupttext (creme) |
| `--color-ink-soft` | `#b9b1a3` | Fließtext |
| `--color-muted` | `#857d70` | Labels, Meta |
| `--color-accent` | `#c9a96a` | Champagner-Gold (Akzent) |
| `--font-display` | Cormorant Garamond | Überschriften |
| `--font-ui` | Montserrat | UI / Fließtext |
| `--font-script` | Pinyon Script | (verfügbar) |
| `--shell-max` | `1280px` | Inhaltsbreite |
| `--section-y` | `clamp(72px,11vh,168px)` | Sektions-Rhythmus |

Markenfarbe wechseln = `--color-accent` ändern. Sonst nichts.

## Selektor-Vertrag für die CMS-Anbindung

JS findet Elemente **ausschließlich über `data-*`** (Klassen sind nur für Stil):

| Hook | Zweck |
|---|---|
| `[data-site-header]` | Header (Scroll-Zustand `.is-scrolled`) |
| `[data-nav-toggle]` / `[data-nav-drawer]` | Mobiles Menü |
| `[data-reveal]`, `[data-reveal-delay="1\|2\|3"]` | Scroll-Animation |
| `[data-faq-item]` / `[data-faq-q]` / `[data-faq-a]` | FAQ-Akkordeon |
| `[data-contact-form]` / `[data-form-submit]` / `[data-form-success]` | Formular |
| `[data-seo-primary]` | Wichtigstes Bild der Seite (nicht lazy) |

**Struktur-Konventionen**

- `header.site-header` → `main.page.page--{name}` → `footer.site-footer` auf jeder Seite.
- Jede Sektion: `<section id="…" class="section section--…" data-block="…">` mit stabiler `id`
  (`hero`, `intro`, `services`, `portfolio`, `prices`, `faq`, `testimonials`, `contact`).
- Wiederholbare Listen tragen `data-collection="…"` (services, portfolio, prices, faq,
  testimonials, posts); jedes Element ist baugleich, Varianten nur per Modifier
  (`price-card--featured`, `service-card--featured`).
- **BEM** ohne Abkürzungen, genau ein `<h1>` pro Seite, Akzentwörter via `<span class="accent">`.
- Bilder: `<img>` in `figure.media` mit `aspect-ratio` + `overflow:hidden`,
  `object-fit:cover` und `object-position` (Inline-Custom-Property, damit kein Hundekopf
  abgeschnitten wird). Alle mit `alt`, `width`, `height`; Hero/Primärbild ohne `loading="lazy"`.
- SEO im `<head>`: `title`, `description`, Open-Graph, `canonical`.
- **Progressive Enhancement:** ohne JS bleibt alles lesbar; FAQ und Formular funktionieren
  als normale Elemente, Reveal-Inhalte sind sichtbar.
- **Mobile-first** Breakpoints (680 / 760 / 1024 px), kein `!important`.

### Dokumentierte Ausnahmen
1. Mini-Inline-Skript `document.documentElement.classList.add("js")` im `<head>` — verhindert
   ein Aufblitzen der Reveal-Inhalte (No-FOUC).
2. Inline `style="object-position:…"` an Bildern (Bildausschnitt-Steuerung).

## Wird bei der CMS-Integration ergänzt (bewusst NICHT enthalten)

Meta-/OG-Feintuning, JSON-LD (Schema.org), `robots.txt`, `sitemap.xml`, Cookie-Banner
(z. B. Klaro), GA4 / Meta-Pixel, Consent Mode v2, Spam-Schutz fürs Formular,
Responsive-Bildvarianten (`srcset`/`<picture>`).

## Offene Inhalte

- **Stimmen** auf der Startseite: derzeit wiederkehrende, verifizierte Kundenfeedback-Themen aus dem Briefing (keine erfundenen Namen). Zum Launch werden die echten Google-Bewertungen eingebunden.
- **Blog** ist bewusst aus der Navigation ausgeblendet (Wunsch: „später"); `blog.html` enthält Platzhalter-Artikel und ist nur direkt erreichbar.
- **Impressum & Datenschutz** basieren auf den echten Stammdaten (alte Website + Briefing) und sind auf den neuen Stack abgestimmt; vor Go-live anwaltlich prüfen lassen. Die Steuernummer (51 498 076 820) wurde im Briefing als „USt-IdNr." geführt — das Format entspricht einer Steuernummer; bitte bestätigen.
- **Meta-Pixel / Google Analytics** erst mit Consent-Banner aktivieren (Pixel-ID liegt vor; Server-Token bleibt geheim).

Sprache durchgehend Deutsch, Anrede „Sie".
