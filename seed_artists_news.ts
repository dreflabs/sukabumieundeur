import { pool } from './src/lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding Artists and News...');
  
  try {
    // 1. Create Artists table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.artists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(150) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL,
        image_url TEXT,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Artists table verified/created');

    // 2. Seed Artists
    await pool.query(`
      INSERT INTO public.artists (name, role, image_url)
      VALUES 
      ('KUNTO AJI', 'HEADLINER', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop'),
      ('FEAST', 'ROCK', 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?q=80&w=800&auto=format&fit=crop'),
      ('HINDIA', 'ALTERNATIVE', 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?q=80&w=800&auto=format&fit=crop'),
      ('BILLFOLD', 'HARDCORE', 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop'),
      ('REALITY CLUB', 'INDIE', 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=800&auto=format&fit=crop'),
      ('THE ADAMS', 'INDIE ROCK', 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f992?q=80&w=800&auto=format&fit=crop'),
      ('BURGERKILL', 'METAL', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop'),
      ('DEADSQUAD', 'DEATH METAL', 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log('✅ Artists seeded');

    // Get a user ID for authoring news
    const users = await pool.query('SELECT id FROM public.profiles LIMIT 1');
    let authorId = null;
    if (users.rows.length === 0) {
      // Create a dummy user if profiles is empty
      const res = await pool.query(`
        INSERT INTO public.profiles (email, password_hash, username, full_name, role)
        VALUES ('admin@sukabumieundeur.com', '${bcrypt.hashSync('Sukabumi2025!', 10)}', 'admin', 'System Admin', 'SUPER_ADMIN')
        RETURNING id;
      `);
      authorId = res.rows[0].id;
    } else {
      authorId = users.rows[0].id;
    }

    // 3. Seed News
    await pool.query(`
      INSERT INTO public.news_articles (slug, title, excerpt, content, cover_image, author_id, category, status, published_at)
      VALUES 
      ('lineup-pertama-dirilis', 'EUNDEUR FEST 2025: LINEUP PERTAMA RESMI DIRILIS!', 'Persiapan festival musik terbesar di Sukabumi telah dimulai. Penampil utama siap menggetarkan panggung.', '<p>Full content goes here</p>', 'https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=800&auto=format&fit=crop', $1, 'FESTIVAL', 'PUBLISHED', NOW()),
      ('sukabumi-punya-panggung', 'SUKABUMI PUNYA PANGGUNG: EUNDEUR MOVEMENT SEMAKIN KUAT', 'Geliat kancah musik bawah tanah Sukabumi semakin tidak bisa diabaikan.', '<p>Full content goes here</p>', 'https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=800&auto=format&fit=crop', $1, 'COMMUNITY', 'PUBLISHED', NOW() - INTERVAL '4 days'),
      ('kolaborasi-komunitas-lokal', 'KOLABORASI EUNDEUR X KOMUNITAS LOKAL UNTUK PERUBAHAN', 'Selain musik, pergerakan ini merangkul seniman visual.', '<p>Full content goes here</p>', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', $1, 'NEWS', 'PUBLISHED', NOW() - INTERVAL '6 days'),
      ('tips-bertahan-di-pit', 'TIPS BERTAHAN DI PIT: PANDUAN UNTUK FESTIVAL GOERS PEMULA', 'Ini dia beberapa etika yang wajib diketahui di moshpit.', '<p>Full content goes here</p>', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop', $1, 'GUIDE', 'PUBLISHED', NOW() - INTERVAL '14 days'),
      ('merch-eksklusif-terbaru', 'MERCHANDISE EKSKLUSIF TERBARU SEGERA DIRILIS', 'Kolaborasi artikel spesial dengan illustrator ternama akan segera rilis.', '<p>Full content goes here</p>', 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop', $1, 'MERCH', 'PUBLISHED', NOW() - INTERVAL '19 days')
      ON CONFLICT (slug) DO NOTHING;
    `, [authorId]);
    console.log('✅ News Articles seeded');

    console.log('Seeding Phase 2 completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
