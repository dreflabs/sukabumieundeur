-- ==============================================================================
-- SUKABUMI EUNDEUR — PRIORITAS 2 FIXES (00005_prioritas_2_fixes.sql)
-- ==============================================================================

-- 1. Perbaikan Bug Skema Merch
ALTER TABLE public.merch_products ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 0;

-- 2. Memindahkan Gallery & History ke Database
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.history_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year VARCHAR(10) NOT NULL,
    title VARCHAR(200) NOT NULL,
    date VARCHAR(50) NOT NULL,
    venue VARCHAR(150) NOT NULL,
    attendees VARCHAR(100) NOT NULL,
    headliners TEXT[] DEFAULT '{}',
    aftermovie_url TEXT,
    cover TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Modul Contact & Settings Dasar
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
