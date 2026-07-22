import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketCategoryId, quantity, userId } = body;

    if (!ticketCategoryId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Kategori tiket dan jumlah kuota wajib diisi.' },
        { status: 400 }
      );
    }

    // Atomic SQL Query to decrement available_quota safely without race condition overbooking
    const updatedCategory = await query(
      `UPDATE ticket_categories 
       SET available_quota = available_quota - $1, updated_at = NOW() 
       WHERE id = $2 AND available_quota >= $1 
       RETURNING *`,
      [quantity, ticketCategoryId]
    );

    // Calculate 15 minutes hold expiration timestamp
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const reservationId = `hold-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    if (updatedCategory.length > 0) {
      // Record ticket_reservation in database
      await query(
        `INSERT INTO ticket_reservations (id, user_id, ticket_category_id, quantity, expires_at, status) 
         VALUES ($1, $2, $3, $4, $5, 'HOLD')`,
        [reservationId, userId || '00000000-0000-0000-0000-000000000000', ticketCategoryId, quantity, expiresAt]
      );
    }

    // Response with 15 minutes hold reservation token
    return NextResponse.json({
      success: true,
      message: 'Kuota tiket berhasil dikunci selama 15 menit!',
      data: {
        reservationId: reservationId,
        ticketCategoryId: ticketCategoryId,
        quantity: quantity,
        expiresAt: expiresAt,
        holdMinutes: 15
      }
    });
  } catch (error: any) {
    console.error('Error holding ticket quota:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat mengunci tiket. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
