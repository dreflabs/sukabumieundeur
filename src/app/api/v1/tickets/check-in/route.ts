import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyServerActionAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const adminSession = await verifyServerActionAuth(['SUPER_ADMIN', 'ORGANISER']);

    const { ticketCode } = await request.json();

    if (!ticketCode) {
      return NextResponse.json(
        { success: false, error: 'Kode tiket wajib diisi.' },
        { status: 400 }
      );
    }

    // Check ticket
    const tickets = await query<any>(
      `SELECT t.id, t.status, t.ticket_code, p.full_name, c.name as category_name, c.event_id
       FROM public.tickets t
       JOIN public.profiles p ON t.user_id = p.id
       JOIN public.ticket_categories c ON t.ticket_category_id = c.id
       WHERE t.ticket_code = $1`,
      [ticketCode]
    );

    if (tickets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tiket tidak ditemukan.' },
        { status: 404 }
      );
    }

    const ticket = tickets[0];

    if (ticket.status === 'CHECKED_IN') {
      return NextResponse.json(
        { success: false, error: 'Tiket sudah digunakan sebelumnya (CHECKED IN).' },
        { status: 400 }
      );
    }

    // Check organiser scope
    if (adminSession.role === 'ORGANISER') {
      try {
        const isAssigned = await query(
          `SELECT 1 FROM event_organisers WHERE user_id = $1 AND event_id = $2`,
          [adminSession.userId, ticket.event_id]
        );
        if (isAssigned.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Akses ditolak: Anda tidak ditugaskan untuk event ini.' },
            { status: 403 }
          );
        }
      } catch (e) {
        // Table might not exist yet, fallback gracefully or deny
        console.error('event_organisers check failed:', e);
      }
    }

    if (ticket.status !== 'ISSUED') {
      return NextResponse.json(
        { success: false, error: `Tiket tidak valid. Status saat ini: ${ticket.status}` },
        { status: 400 }
      );
    }

    // Update to CHECKED_IN
    await query(
      `UPDATE public.tickets 
       SET status = 'CHECKED_IN', checked_in_at = NOW() 
       WHERE ticket_code = $1`,
      [ticketCode]
    );

    return NextResponse.json({
      success: true,
      message: 'Tiket berhasil divalidasi.',
      data: {
        ticketCode: ticket.ticket_code,
        attendeeName: ticket.full_name,
        category: ticket.category_name
      }
    });

  } catch (error: any) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
