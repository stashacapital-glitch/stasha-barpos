-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ORGANIZATIONS (Multi-tenant root)
create table public.organizations (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  slug text unique,
  plan text default 'basic'::text, -- basic, standard, regular, pro
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. PROFILES (Staff/Users)
create table public.profiles (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  email text unique,
  full_name text,
  role text default 'staff'::text, -- admin, manager, staff
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. PLANS (For your pricing page logic)
create table public.plans (
  id uuid not null default gen_random_uuid() primary key,
  name text unique,
  price_kes integer, -- Store in smallest currency unit or decimal
  features text[], -- Array of strings
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. CUSTOMERS
create table public.customers (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  name text,
  phone text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. ROOMS (Hotel Management)
create table public.rooms (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  room_number text,
  type text, -- Single, Double, Suite
  status text default 'available'::text, -- available, occupied, maintenance
  price_per_night integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. STAYS (Hotel Bookings)
create table public.stays (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  room_id uuid references public.rooms(id),
  customer_id uuid references public.customers(id),
  check_in timestamp with time zone,
  check_out timestamp with time zone,
  status text default 'active'::text, -- active, checked_out
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. TABLES (Bar/Restaurant Tables)
create table public.tables (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  table_number integer,
  status text default 'open'::text, -- open, seated, closed
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. CATEGORIES (Menu Categories)
create table public.categories (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 9. MENU_ITEMS (Drinks/Food)
create table public.menu_items (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  category_id uuid references public.categories(id),
  name text,
  price integer, -- Store in cents or lowest unit
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 10. ORDERS
create table public.orders (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  table_id uuid references public.tables(id),
  customer_id uuid references public.customers(id),
  status text default 'pending'::text, -- pending, completed, cancelled
  total integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 11. SALES (Transaction Records)
create table public.sales (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  order_id uuid references public.orders(id),
  amount integer,
  payment_method text, -- cash, mpesa, card
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 12. INVENTORY_LOG
create table public.inventory_log (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  item_name text,
  quantity_change integer,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 13. STOCK_MOVEMENTS
create table public.stock_movements (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id),
  quantity integer,
  type text, -- in, out
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 14. EXPENSES
create table public.expenses (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  description text,
  amount integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 15. COSTS (Operational Costs)
create table public.costs (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  category text,
  amount integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 16. AUDIT_LOGS
create table public.audit_logs (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid,
  action text,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 17. PAYROLL_HISTORY
create table public.payroll_history (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  staff_id uuid references public.profiles(id),
  amount integer,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 18. SETTINGS
create table public.settings (
  id uuid not null default gen_random_uuid() primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  key text,
  value text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);