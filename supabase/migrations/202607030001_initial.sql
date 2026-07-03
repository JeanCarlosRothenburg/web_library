create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'appointment_status') then
    create type public.appointment_status as enum ('pending', 'confirmed', 'completed', 'canceled');
  end if;
end $$;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  codigo_livro text not null unique,
  title text not null,
  author text not null,
  synopsis text not null,
  genre text not null default 'Geral',
  language text not null default 'Português',
  published_year integer not null default extract(year from now())::integer,
  pages integer not null default 0,
  total_copies integer not null default 0,
  available_copies integer not null default 0,
  popularity_score integer not null default 0,
  featured_rank integer not null default 9999,
  cover_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  avatar_url text,
  role text not null default 'reader' check (role in ('reader', 'librarian')),
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scheduled_for timestamptz not null,
  status public.appointment_status not null default 'pending',
  contact_name text not null,
  contact_phone text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointment_items (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  book_id uuid not null references public.books(id),
  book_code text not null,
  title_snapshot text not null,
  author_snapshot text not null,
  position integer not null default 1,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(new.raw_user_meta_data->>'role', 'reader')
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        phone = excluded.phone,
        avatar_url = excluded.avatar_url,
        role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.books enable row level security;
alter table public.profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_items enable row level security;

drop policy if exists "Books are viewable by everyone" on public.books;
create policy "Books are viewable by everyone"
on public.books
for select
using (true);

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can view own appointments" on public.appointments;
create policy "Users can view own appointments"
on public.appointments
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own appointments" on public.appointments;
create policy "Users can create own appointments"
on public.appointments
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own appointments" on public.appointments;
create policy "Users can update own appointments"
on public.appointments
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own appointment items" on public.appointment_items;
create policy "Users can read own appointment items"
on public.appointment_items
for select
using (
  exists (
    select 1
    from public.appointments appointments_scope
    where appointments_scope.id = appointment_items.appointment_id
      and appointments_scope.user_id = auth.uid()
  )
);

drop policy if exists "Users can add items to own appointments" on public.appointment_items;
create policy "Users can add items to own appointments"
on public.appointment_items
for insert
with check (
  exists (
    select 1
    from public.appointments appointments_scope
    where appointments_scope.id = appointment_items.appointment_id
      and appointments_scope.user_id = auth.uid()
  )
);

drop policy if exists "Users can update items from own appointments" on public.appointment_items;
create policy "Users can update items from own appointments"
on public.appointment_items
for update
using (
  exists (
    select 1
    from public.appointments appointments_scope
    where appointments_scope.id = appointment_items.appointment_id
      and appointments_scope.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.appointments appointments_scope
    where appointments_scope.id = appointment_items.appointment_id
      and appointments_scope.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete items from own appointments" on public.appointment_items;
create policy "Users can delete items from own appointments"
on public.appointment_items
for delete
using (
  exists (
    select 1
    from public.appointments appointments_scope
    where appointments_scope.id = appointment_items.appointment_id
      and appointments_scope.user_id = auth.uid()
  )
);

insert into public.books (
  codigo_livro,
  title,
  author,
  synopsis,
  genre,
  language,
  published_year,
  pages,
  total_copies,
  available_copies,
  popularity_score,
  featured_rank,
  cover_url
)
values
  (
    'BGV-0001',
    'Verde Amanhecer',
    'Helena Duarte',
    'Uma coletânea de memórias da cidade, mesclando literatura regional, encontros na praça e a rotina silenciosa da biblioteca.',
    'Romance histórico',
    'Português',
    2024,
    248,
    7,
    4,
    93,
    1,
    null
  ),
  (
    'BGV-0002',
    'Mapa das Chuvas',
    'Caio Nascimento',
    'Um relato sensível sobre deslocamento, pertencimento e o modo como pequenos lugares guardam histórias imensas.',
    'Ficção contemporânea',
    'Português',
    2025,
    312,
    5,
    2,
    88,
    2,
    null
  ),
  (
    'BGV-0003',
    'A Sala de Leitura',
    'Marina Fagundes',
    'Entre estantes e cadernos, uma narradora encontra vínculos com a cidade, a escola e os hábitos que mantêm a cultura viva.',
    'Crônica',
    'Português',
    2023,
    184,
    6,
    6,
    81,
    3,
    null
  ),
  (
    'BGV-0004',
    'Silêncios do Rio',
    'Rafael Moraes',
    'Narrativa sobre memória familiar, natureza e o tempo que corre em paralelo ao curso do rio na região sul.',
    'Drama',
    'Português',
    2022,
    276,
    4,
    1,
    96,
    4,
    null
  ),
  (
    'BGV-0005',
    'Atlas da Espera',
    'Lia Monteiro',
    'Ensaios curtos sobre circulação, tempo livre e os rituais cotidianos que transformam uma biblioteca em ponto de encontro.',
    'Ensaio',
    'Português',
    2021,
    220,
    3,
    3,
    79,
    5,
    null
  ),
  (
    'BGV-0006',
    'O Jardim das Letras',
    'Nina Porto',
    'Uma obra afetiva sobre infância, leitura e o poder das pequenas cidades para cultivar leitores ao longo do tempo.',
    'Infantil',
    'Português',
    2025,
    96,
    8,
    7,
    84,
    6,
    null
  )
on conflict (codigo_livro) do nothing;

