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

    // Fallback mock data if database table has no records yet
    if (ticketCategories.length === 0) {
      const mockCategories: TicketCategory[] = [
        {
          id: 'cat-111111-early-bird',
          event_id: eventId || '11111111-1111-1111-1111-111111111111',
          name: 'UNDERGROUND PASS (EARLY BIRD)',
          description: 'Akses All Stage Festival + Free Official Sticker Set',
          price: 75000,
          quota: 500,
          available_quota: 142,
          max_per_transaction: 4,
          sale_start: '2026-06-01T00:00:00Z',
          sale_end: '2026-08-14T23:59:00Z',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'cat-222222-presale',
          event_id: eventId || '11111111-1111-1111-1111-111111111111',
          name: 'MOSHPIT VIP PASS (PRESALE)',
          description: 'Front Row Moshpit Access + Official Poster + Fast-Track QR Check-in',
          price: 150000,
          quota: 1000,
          available_quota: 388,
          max_per_transaction: 4,
          sale_start: '2026-06-01T00:00:00Z',
          sale_end: '2026-08-14T23:59:00Z',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'cat-333333-all-access',
          event_id: eventId || '11111111-1111-1111-1111-111111111111',
          name: 'EUNDEUR ALL ACCESS BUNDLE',
          description: 'VIP Lounge, Backstage Access, Fest T-Shirt, Meet & Greet Headliner',
          price: 300000,
          quota: 200,
          available_quota: 45,
          max_per_transaction: 2,
          sale_start: '2026-06-01T00:00:00Z',
          sale_end: '2026-08-14T23:59:00Z',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return NextResponse.json({ success: true, data: mockCategories });
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
