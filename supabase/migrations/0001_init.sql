-- Marques
create table if not exists brands (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  founded_year  int,
  logo_url      text,
  created_at    timestamptz default now()
);

-- Téléphones
create table if not exists phones (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid references brands(id) on delete cascade,
  slug            text unique not null,
  name            text not null,
  release_year    int not null,
  release_date    date,
  is_milestone    boolean default false,
  milestone_note  text,

  screen_size     numeric,
  screen_type     text,
  refresh_rate    int,
  processor       text,
  ram_gb          int,
  storage_gb      int,
  battery_mah     int,
  main_camera_mp  int,
  weight_g        int,
  price_launch    numeric,

  extra_specs     jsonb default '{}',

  created_at      timestamptz default now()
);

create index if not exists phones_brand_id_idx on phones(brand_id);
create index if not exists phones_release_year_idx on phones(release_year);

-- Photos (plusieurs par téléphone)
create table if not exists phone_images (
  id          uuid primary key default gen_random_uuid(),
  phone_id    uuid references phones(id) on delete cascade,
  url         text not null,
  alt         text,
  sort_order  int default 0
);

-- Lecture publique, écriture réservée aux utilisateurs authentifiés (l'admin)
alter table brands enable row level security;
alter table phones enable row level security;
alter table phone_images enable row level security;

create policy "public read brands" on brands for select using (true);
create policy "public read phones" on phones for select using (true);
create policy "public read phone_images" on phone_images for select using (true);

create policy "authenticated write brands" on brands
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write phones" on phones
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated write phone_images" on phone_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
