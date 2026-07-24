import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Event } from '@/types/database';
import { requireAdminRole } from '@/lib/requireAdmin';

// Helper function to create slug from title
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// GET: Fetch all events
export async function GET() {
  const auth = await requireAdminRole(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
  if (!auth.success) return auth.response;

  try {
    const events = await query<Event>(
      `SELECT * FROM events ORDER BY start_date DESC`
    );
    
    return NextResponse.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data event.' },
      { status: 500 }
    );
  }
}

// POST: Create new event
export async function POST(request: NextRequest) {
  const auth = await requireAdminRole(['SUPER_ADMIN', 'ORGANISER']);
  if (!auth.success) return auth.response;

  try {
    const body = await request.json();
    const { title, description, venue, city, start_date, end_date, banner_url, is_active } = body;

    if (!title || !description || !venue || !city || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, error: 'Semua field wajib diisi (kecuali banner).' },
        { status: 400 }
      );
    }

    const baseSlug = createSlug(title);
    let slug = baseSlug;
    let suffix = 1;
    
    // Ensure slug uniqueness
    while (true) {
      const existing = await query(`SELECT id FROM events WHERE slug = $1`, [slug]);
      if (existing.length === 0) break;
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const newEvent = await query<Event>(
      `INSERT INTO events (slug, title, description, venue, city, start_date, end_date, banner_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        slug,
        title,
        description,
        venue,
        city,
        new Date(start_date).toISOString(),
        new Date(end_date).toISOString(),
        banner_url || null,
        is_active ?? true
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Event berhasil dibuat.',
      data: newEvent[0]
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat event baru.' },
      { status: 500 }
    );
  }
}
