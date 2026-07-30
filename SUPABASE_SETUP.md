# Supabase Setup (Login)

Die App nutzt [Supabase](https://supabase.com) für echte Nutzerkonten. Da die
App nur für ein paar Personen gedacht ist, gibt es keine E-Mail/Passwort-Hürde:
man trägt beim ersten Besuch nur seinen Namen ein, im Hintergrund läuft ein
anonymer Supabase-Account. Das Projekt musst du selbst anlegen — hier die
Schritte:

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

⚠️ Nur den **anon/public key** verwenden. Der `service_role`-Key bzw.
`sb_secret_...`-Key darf niemals in die App oder ins Git-Repo — der hat
vollen Admin-Zugriff auf die Datenbank.

## 3. Anonyme Anmeldung aktivieren

Im Dashboard unter **Authentication → Sign In / Providers → Anonymous
Sign-Ins** den Schalter aktivieren. Ohne das schlägt die Namenseingabe fehl.

## 4. Datenbank-Tabelle anlegen

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

Für das "Lieblingsziele & Wünsche"-Feature (Herz-Button + Kommentare an
den Stopps, sichtbar für alle) zusätzlich:

```sql
create table if not exists public.stop_reactions (
  stop_id text not null,
  user_id uuid not null references auth.users on delete cascade,
  display_name text not null,
  wish text,
  created_at timestamptz not null default now(),
  primary key (stop_id, user_id)
);

alter table public.stop_reactions enable row level security;

drop policy if exists "Signed-in users can view all reactions" on public.stop_reactions;
drop policy if exists "Users manage their own reaction" on public.stop_reactions;
drop policy if exists "Users update their own reaction" on public.stop_reactions;
drop policy if exists "Users delete their own reaction" on public.stop_reactions;

create policy "Signed-in users can view all reactions"
  on public.stop_reactions for select
  using (auth.uid() is not null);

create policy "Users manage their own reaction"
  on public.stop_reactions for insert
  with check (auth.uid() = user_id);

create policy "Users update their own reaction"
  on public.stop_reactions for update
  using (auth.uid() = user_id);

create policy "Users delete their own reaction"
  on public.stop_reactions for delete
  using (auth.uid() = user_id);
```

Für den Tab "Ideen & Anmerkungen" (freies Feedback/Notizen, sichtbar für
alle) zusätzlich:

```sql
create table if not exists public.trip_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  display_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.trip_notes enable row level security;

drop policy if exists "Signed-in users can view all notes" on public.trip_notes;
drop policy if exists "Users can add notes" on public.trip_notes;
drop policy if exists "Users can delete their own notes" on public.trip_notes;

create policy "Signed-in users can view all notes"
  on public.trip_notes for select
  using (auth.uid() is not null);

create policy "Users can add notes"
  on public.trip_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on public.trip_notes for delete
  using (auth.uid() = user_id);
```

## 5. Auf Vercel eintragen

Im Vercel-Projekt unter **Settings → Environment Variables** dieselben zwei
Variablen (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) hinzufügen, dann
neu deployen.

---

Ohne diese Variablen zeigt die App einen Hinweisbildschirm
("Supabase ist noch nicht verbunden") statt des Logins.

Hinweis zur anonymen Anmeldung: Die Sitzung hängt am Browser/Gerät (im
`localStorage`), nicht an einem Passwort. Wer die Browserdaten löscht oder
ein anderes Gerät nutzt, landet wieder auf der Namenseingabe und bekommt
einen neuen (leeren) Eintrag. Da es keine privaten Nutzerdaten gibt – die
Routen sind für alle gleich –, ist das ohne Nachteil.
