# 🏍️ Norwegen Motorrad Roadtrip – Routenplaner

Interaktive Web-App zur Routenplanung für eine Motorradtour nach Norwegen.
Basiert auf React + Vite + Leaflet/OpenStreetMap (keine API-Keys nötig).

## Features (aktueller Stand)

- **Login** (Supabase, anonym) – beim ersten Besuch reicht der Name, kein Passwort/E-Mail nötig
- **Abenteuer-Routen**: zwei vorgeplante Touren durch Dänemark/Norwegen
  (Route 1 mit Fähre Hirtshals–Kristiansand, Route 2 komplett über Land via
  Schweden), für alle Nutzer gleich und fest hinterlegt
  - Scrollbare Stopp-Timeline mit echten Fotos (Wikimedia Commons, mit
    Quellenangabe), Fun Facts und Detail-Ansicht pro Stopp
  - Karte folgt automatisch dem Stopp, an dem gerade gescrollt wird
  - Vergleich der beiden Routen (Distanz, Fähre vs. Landweg)
- **Eigene Route** (zweiter Tab): freies Planen wie bisher – Wegpunkte per
  Klick auf die Karte oder Namenssuche (Nominatim) hinzufügen, per Drag & Drop
  verschieben, Reihenfolge ändern, Gesamtstrecke/Fahrzeit berechnen; wird in
  `localStorage` gespeichert
- Helles/dunkles Kartendesign (CARTO) passend zum System-Farbschema
- Mobile-optimiert (Bottom-Sheet auf dem Freiform-Planer, gestapeltes Layout
  im Routen-Explorer)

> Wird noch erweitert (z. B. echte Routenführung entlang von Straßen,
> Höhenprofil, Etappenplanung, gemeinsame Notizen/Wünsche für alle Nutzer).

## Lokal starten

```bash
npm install
cp .env.example .env.local   # siehe SUPABASE_SETUP.md
npm run dev
```

Die App läuft danach auf `http://localhost:5173`. Ohne gültige
Supabase-Zugangsdaten in `.env.local` zeigt die App einen Setup-Hinweis
statt des Logins – siehe [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Build

```bash
npm run build
npm run preview
```

## Auf GitHub veröffentlichen

```bash
git init
git add .
git commit -m "Initial commit: Norwegen Roadtrip Routenplaner"
git branch -M main
git remote add origin https://github.com/<dein-user>/<dein-repo>.git
git push -u origin main
```

## Auf Vercel deployen

1. Auf [vercel.com](https://vercel.com) einloggen (z. B. mit GitHub-Account).
2. **New Project** → das gerade gepushte GitHub-Repo auswählen.
3. Vercel erkennt Vite automatisch (Build Command: `npm run build`,
   Output Directory: `dist`) – einfach auf **Deploy** klicken.

Jeder Push auf `main` erzeugt danach automatisch ein neues Deployment.

## Tech-Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [Supabase](https://supabase.com/) für Login/Nutzerkonten (siehe [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
- [Leaflet](https://leafletjs.com/) / [react-leaflet](https://react-leaflet.js.org/) für die Karte
- [OpenStreetMap](https://www.openstreetmap.org/) / [CARTO](https://carto.com/) Kartendaten
- [Nominatim](https://nominatim.org/) für die Ortssuche
- [Wikimedia Commons](https://commons.wikimedia.org/) für die Stopp-Fotos (freie Lizenzen, Quellenangabe im Detail-Modal)
