-- Phase 4: Business, Sponsors & Super Admin Setup

-- 1. Create Sponsors Table
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    logo_url TEXT NOT NULL,
    tier VARCHAR(50) DEFAULT 'STANDARD' NOT NULL, -- PLATINUM, GOLD, SILVER, STANDARD
    url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for auto updated_at on sponsors
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sponsors_updated_at') THEN
        CREATE TRIGGER update_sponsors_updated_at 
        BEFORE UPDATE ON public.sponsors 
        FOR EACH ROW 
        EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END
$$;

-- 2. Seed Super Admin User
-- We use pgcrypto extension (enabled in 00001_init_schema) to hash the password directly in DB
INSERT INTO public.profiles (
    email, 
    password_hash, 
    username, 
    full_name, 
    role, 
    created_at, 
    updated_at
) VALUES (
    'superadmin@sukabumieundeurindonesia.com', 
    NULL, -- password removed for security, must be set via admin console or env
    'superadmin', 
    'Super Administrator', 
    'SUPER_ADMIN', 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO NOTHING;
