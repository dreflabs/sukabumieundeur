import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { TicketCategory } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');

    let ticketCategories: TicketCategory[] = [];

    if (eventId) {
      ticketCategories = await query<TicketCategory>(
        `SELECT * FROM ticket_categories WHERE event_id = $1 ORDER BY price ASC`,
        [eventId]
      );
    } else {
      ticketCategories = await query<TicketCategory>(
        `SELECT * FROM ticket_categories ORDER BY price ASC`
      );
    }

    // Fallback if database table has no records yet
    if (ticketCategories.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: ticketCategories });
  } catch (error: any) {
    console.error('Error fetching ticket categories:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil kategori tiket.' },
      { status: 500 }
    );
  }
}
