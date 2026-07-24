-- Phase 1: Security and Integrity Migration
-- Description: Drop RLS to align with Application Architecture, and create missing Event-Artist relations.

-- 1. Disable RLS (Row Level Security) across all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.merch_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.merch_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts DISABLE ROW LEVEL SECURITY;

-- 2. Create Event-Artists relation table for Lineups
CREATE TABLE IF NOT EXISTS public.event_artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    performance_time TIMESTAMPTZ,
    stage_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, artist_id)
);

-- Index for fast lineup queries
CREATE INDEX IF NOT EXISTS idx_event_artists_event_id ON public.event_artists(event_id);
