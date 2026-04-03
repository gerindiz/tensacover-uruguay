-- TensaCover Uruguay — Schema inicial
-- Ejecutar en el SQL Editor de Supabase

-- Tabla de modelos de carpas
create table if not exists carpas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nombre text not null,
  categoria text,
  descripcion text,
  caracteristicas jsonb default '[]',
  imagen_url text,
  detalles text,
  popular boolean default false,
  dimensiones text,
  capacidad_personas integer default 0,
  precio_referencia numeric(10,2) default 0
);

-- Tabla de consultas / leads
create table if not exists consultas_clientes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nombre text not null,
  email text not null,
  telefono text,
  modelo_carpa text,
  mensaje text,
  estado text default 'Pendiente' check (estado in ('Pendiente', 'Contactado', 'Cerrado'))
);

-- RLS: solo lectura pública para carpas
alter table carpas enable row level security;
create policy "carpas_public_read" on carpas for select using (true);

-- RLS: inserción pública para consultas (el form del sitio)
alter table consultas_clientes enable row level security;
create policy "consultas_public_insert" on consultas_clientes for insert with check (true);
-- Solo el service role (admin) puede leer y actualizar
create policy "consultas_service_read" on consultas_clientes for select using (auth.role() = 'service_role');
create policy "consultas_service_update" on consultas_clientes for update using (auth.role() = 'service_role');
