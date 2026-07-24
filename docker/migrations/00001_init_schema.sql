-- ==============================================================================
-- SUKABUMI EUNDEUR — INITIAL SELF-HOSTED POSTGRESQL MIGRATION (00001_init_schema.sql)
-- Complete PostgreSQL DDL, Indexes, Triggers, & Constraints
-- ==============================================================================

-- Enable required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. ENUMS
-- ------------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER', 'ARTIST', 'MEMBER', 'GUEST');
CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED', 'REFUNDED');
CREATE TYPE ticket_status AS ENUM ('RESERVED', 'ISSUED', 'CHECKED_IN', 'CANCELLED');
CREATE TYPE article_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- ------------------------------------------------------------------------------
-- 2. USERS & PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    role user_role DEFAULT 'MEMBER'::user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. EVENTS & FESTIVALS
-- ------------------------------------------------------------------------------
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    venue VARCHAR(150) NOT NULL,
    city VARCHAR(50) DEFAULT 'Sukabumi' NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    banner_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3.5. ARTISTS & LINEUP
-- ------------------------------------------------------------------------------
CREATE TABLE public.artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 4. TICKETING SYSTEM
-- ------------------------------------------------------------------------------
CREATE TABLE public.ticket_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    quota INT NOT NULL CHECK (quota >= 0),
    available_quota INT NOT NULL CHECK (available_quota >= 0),
    max_per_transaction INT DEFAULT 4 NOT NULL,
    sale_start TIMESTAMPTZ NOT NULL,
    sale_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.ticket_categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.ticket_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    ticket_category_id UUID REFERENCES public.ticket_categories(id) ON DELETE RESTRICT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'HOLD' NOT NULL, -- HOLD, CONVERTED, EXPIRED
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.ticket_reservations ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 5. MERCHANDISE E-COMMERCE
-- ------------------------------------------------------------------------------
CREATE TABLE public.merch_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    base_price DECIMAL(12,2) NOT NULL CHECK (base_price >= 0),
    category VARCHAR(50) NOT NULL,
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.merch_products ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.merch_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.merch_products(id) ON DELETE CASCADE NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(30) NOT NULL,
    stock INT DEFAULT 0 NOT NULL CHECK (stock >= 0),
    sku VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.merch_variants ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6. ORDERS & TRANSACTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    status order_status DEFAULT 'PENDING'::order_status NOT NULL,
    snap_token TEXT,
    payment_method VARCHAR(50),
    paid_at TIMESTAMPTZ,
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_courier VARCHAR(50),
    shipping_cost DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    item_type VARCHAR(20) NOT NULL, -- TICKET or MERCH
    ticket_category_id UUID REFERENCES public.ticket_categories(id),
    merch_variant_id UUID REFERENCES public.merch_variants(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    ticket_category_id UUID REFERENCES public.ticket_categories(id) NOT NULL,
    qr_code_hash TEXT UNIQUE NOT NULL,
    status ticket_status DEFAULT 'ISSUED'::ticket_status NOT NULL,
    checked_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 7. NEWS & CONTENT SYSTEM
-- ------------------------------------------------------------------------------
CREATE TABLE public.news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    author_id UUID REFERENCES public.profiles(id) NOT NULL,
    category VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    status article_status DEFAULT 'DRAFT'::article_status NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 8. COMMUNITY FORUM
-- ------------------------------------------------------------------------------
CREATE TABLE public.forum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Trigger for auto updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ticket_categories_updated_at BEFORE UPDATE ON public.ticket_categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_merch_products_updated_at BEFORE UPDATE ON public.merch_products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 9. PERFORMANCE INDEXES (B-TREE)
-- ------------------------------------------------------------------------------
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX idx_tickets_category_id ON public.tickets(ticket_category_id);
CREATE INDEX idx_ticket_reservations_user_id ON public.ticket_reservations(user_id);
CREATE INDEX idx_ticket_reservations_category_id ON public.ticket_reservations(ticket_category_id);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_ticket_category_id ON public.order_items(ticket_category_id);
CREATE INDEX idx_order_items_merch_variant_id ON public.order_items(merch_variant_id);

CREATE INDEX idx_merch_variants_product_id ON public.merch_variants(product_id);
CREATE INDEX idx_ticket_categories_event_id ON public.ticket_categories(event_id);

CREATE INDEX idx_forum_topics_author_id ON public.forum_topics(author_id);
CREATE INDEX idx_forum_posts_topic_id ON public.forum_posts(topic_id);
CREATE INDEX idx_forum_posts_author_id ON public.forum_posts(author_id);

CREATE INDEX idx_news_articles_author_id ON public.news_articles(author_id);

-- Partial Indexes for fast filtering
CREATE INDEX idx_events_is_active ON public.events(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_orders_status ON public.orders(status) WHERE status IN ('PENDING', 'PAID');
