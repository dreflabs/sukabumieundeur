import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Event } from '@/types/database';

export async function GET() {
  try {
    const events = await query<Event>(
      `SELECT * FROM events WHERE is_active = true ORDER BY start_date ASC`
    );

    // Fallback mock event if database is empty for demo/local dev
    if (events.length === 0) {
      const mockEvent: Event = {
        id: '11111111-1111-1111-1111-111111111111',
        slug: 'sukabumi-eundeur-fest-2026',
        title: 'Sukabumi Eundeur Fest 2026',
        description: 'Pusat Ekosistem Musik Heavy Metal & Underground Culture Sukabumi.',
        venue: 'Stadion Surajaya',
        city: 'Sukabumi',
        start_date: '2026-08-15T12:00:00Z',
        end_date: '2026-08-15T23:59:00Z',
        banner_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return NextResponse.json({ success: true, data: [mockEvent] });
    }

    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data event.' },
      { status: 500 }
    );
  }
}
