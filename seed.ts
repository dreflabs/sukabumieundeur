import { pool } from './src/lib/db';

async function seed() {
  console.log('Seeding database...');
  
  try {
    // 1. Seed Merch Products
    await pool.query(`
      INSERT INTO public.merch_products (id, slug, title, description, base_price, category, images, is_active)
      VALUES 
      ('11111111-1111-1111-1111-111111111111', 'eundeur-fest-25-official-tee', 'EUNDEUR FEST 25 OFFICIAL TEE', 'Official Merchandise for Eundeur Fest 2025.', 250000, 'APPAREL', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop'], true),
      ('22222222-2222-2222-2222-222222222222', 'underground-movement-hoodie', 'UNDERGROUND MOVEMENT HOODIE', 'Premium quality hoodie for the movement.', 450000, 'OUTERWEAR', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'], true),
      ('33333333-3333-3333-3333-333333333333', 'sukabumi-noise-cap', 'SUKABUMI NOISE CAP', 'Black cap with embroidered logo.', 150000, 'ACCESSORIES', ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop'], true)
      ON CONFLICT (slug) DO NOTHING;
    `);
    console.log('✅ Merch Products seeded');

    // 2. Seed Events
    await pool.query(`
      INSERT INTO public.events (id, slug, title, description, venue, city, start_date, end_date, banner_url, is_active)
      VALUES 
      ('44444444-4444-4444-4444-444444444444', 'eundeur-fest-2025', 'EUNDEUR FEST 2025', 'Festival musik bawah tanah terbesar di Sukabumi kembali.', 'Sukabumi Town Square', 'Sukabumi', '2025-09-12 10:00:00+07', '2025-09-12 23:00:00+07', 'https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=800&auto=format&fit=crop', true),
      ('55555555-5555-5555-5555-555555555555', 'underground-movement-oct', 'UNDERGROUND MOVEMENT', 'Pergerakan kancah musik lokal.', 'Gedung Kesenian', 'Sukabumi', '2025-10-25 15:00:00+07', '2025-10-25 23:00:00+07', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop', true)
      ON CONFLICT (slug) DO NOTHING;
    `);
    console.log('✅ Events seeded');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
