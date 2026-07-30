# Supabase Setup (Login/Registrierung)

Die App nutzt [Supabase](https://supabase.com) für echte Nutzerkonten
(E-Mail + Passwort). Das Projekt musst du selbst anlegen — hier die Schritte:

## 1. Projekt anlegen

1. Auf [supabase.com](https://supabase.com) einloggen/registrieren, kostenloser Plan reicht.
2. **New Project** → Name z. B. `norwegen-moto-trip`, Passwort für die Datenbank setzen, Region wählen.
3. Warten, bis das Projekt fertig provisioniert ist (~1–2 Minuten).

## 2. Keys holen

Im Projekt unter **Project Settings → API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

Beide in eine lokale `.env.local` (Kopie von `.env.example`) eintragen:

```bash
cp .env.example .env.local
```

Danach die Werte eintragen und den Dev-Server neu starten.

## 3. Datenbank-Tabelle anlegen

Im Supabase Dashboard unter **SQL Editor** folgendes ausführen:

```sql
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  avatar text not null default '🏍️',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

## 4. E-Mail-Bestätigung (optional)

Standardmäßig verlangt Supabase eine E-Mail-Bestätigung nach der
Registrierung. Für schnelles Testen kannst du das unter
**Authentication → Providers → Email → Confirm email** deaktivieren.
Für den echten Betrieb würde ich es aktiviert lassen.

## 5. Auf Vercel eintragen

Im Vercel-Projekt unter **Settings → Environment Variables** dieselben zwei
Variablen (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) hinzufügen, dann
neu deployen.

---

Ohne diese Variablen zeigt die App einen Hinweisbildschirm
("Supabase ist noch nicht verbunden") statt des Logins.
