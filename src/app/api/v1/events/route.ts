import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Event } from '@/types/database';

export async function GET() {
  try {
    const events = await query<Event>(
      `SELECT * FROM events WHERE is_active = true ORDER BY start_date ASC`
    );

    if (events.length === 0) {
      return NextResponse.json({ success: true, data: [] });
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
