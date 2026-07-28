# 🏍️ Norwegen Motorrad Roadtrip – Routenplaner

Interaktive Web-App zur Routenplanung für eine Motorradtour nach Norwegen.
Basiert auf React + Vite + Leaflet/OpenStreetMap (keine API-Keys nötig).

## Features (aktueller Stand)

- Interaktive Karte (OpenStreetMap) mit Fokus auf Norwegen/Skandinavien
- Wegpunkte per Klick auf die Karte hinzufügen
- Orte per Namenssuche finden und als Stopp hinzufügen (Nominatim-Geocoding)
- Marker per Drag & Drop verschieben
- Reihenfolge der Stopps ändern (rauf/runter) oder entfernen
- Automatische Berechnung von Gesamtstrecke (km, Luftlinie) und geschätzter Fahrzeit
- Route wird automatisch im Browser gespeichert (`localStorage`)

> Basisversion – wird noch erweitert (z. B. echte Routenführung entlang von
> Straßen, Höhenprofil, Etappenplanung, Sehenswürdigkeiten, Export/Import der Route).

## Lokal starten

```bash
npm install
npm run dev
```

Die App läuft danach auf `http://localhost:5173`.

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
- [Leaflet](https://leafletjs.com/) / [react-leaflet](https://react-leaflet.js.org/) für die Karte
- [OpenStreetMap](https://www.openstreetmap.org/) Kartendaten
- [Nominatim](https://nominatim.org/) für die Ortssuche
