/* Klaro! Consent-Konfiguration — Maren Möst Hundefotografie
 *
 * AKTIVIERUNG (Phase 2, als EIN Block):
 *  1. klaro.js + klaro.css lokal ablegen (self-hosted, KEIN CDN) → /js/klaro.js, /css/klaro.css.
 *  2. In <head> jeder Seite: <link rel="stylesheet" href="css/klaro.css">.
 *  3. Vor </body> jeder Seite: <script defer src="js/klaro-config.js"></script>
 *                              <script defer src="js/klaro.js" data-config="klaroConfig"></script>
 *  4. Tracking erst nach Opt-in laden:
 *     <script type="text/plain" data-type="application/javascript" data-name="googleAnalytics"
 *             src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>   (ID nachtragen)
 *     Meta-Pixel-Snippet analog mit data-name="metaPixel".
 *  4b. Google Consent Mode v2: VOR gtag-Laden default = denied setzen
 *      gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',
 *        ad_user_data:'denied',ad_personalization:'denied'});
 *      Klaro-Callback (onAccept) -> gtag('consent','update',{... 'granted'}).
 *      GTM nur, falls Google Ads/viele Tags; sonst direktes Gaten genügt.
 *  5. Google-Maps-iframe (kontakt.html): src -> data-src + data-name="googleMaps"
 *     (lädt erst nach Zustimmung; vorher zeigt Klaro einen Platzhalter).
 *  6. Banner-Dienste = Datenschutz-Seite synchron halten. Vor Go-live juristisch prüfen.
 */
window.klaroConfig = {
  version: 1,
  elementID: 'klaro',
  styling: { theme: ['dark', 'bottom', 'wide'] },
  storageMethod: 'cookie',
  cookieName: 'mm_consent',
  cookieExpiresAfterDays: 180,
  default: false,        // nichts ist standardmäßig aktiv
  mustConsent: false,    // Banner, keine harte Sperre
  acceptAll: true,
  hideDeclineAll: false,
  lang: 'de',
  translations: {
    de: {
      consentModal: {
        title: 'Datenschutz-Einstellungen',
        description:
          'Wir setzen optionale Dienste ein, die personenbezogene Daten verarbeiten (z. B. zur Anzeige der Karte sowie für Statistik und Marketing). Sie entscheiden, was Sie zulassen.',
      },
      consentNotice: {
        description:
          'Wir verwenden optionale Dienste (Google Maps, Statistik, Marketing). {purposes} – Ihre Wahl ist frei und jederzeit widerrufbar.',
        learnMore: 'Einstellungen',
      },
      acceptAll: 'Alle akzeptieren',
      acceptSelected: 'Auswahl speichern',
      decline: 'Ablehnen',
      ok: 'Akzeptieren',
      purposes: { functional: 'Karte', analytics: 'Statistik', marketing: 'Marketing' },
    },
  },
  services: [
    { name: 'googleMaps',      title: 'Google Maps',           purposes: ['functional'], default: false, required: false, cookies: [] },
    { name: 'googleAnalytics', title: 'Google Analytics (GA4)', purposes: ['analytics'],  default: false, required: false, cookies: [/^_ga/, '_gid'] },
    { name: 'metaPixel',       title: 'Meta-Pixel',             purposes: ['marketing'],  default: false, required: false, cookies: ['_fbp'] },
  ],
};
