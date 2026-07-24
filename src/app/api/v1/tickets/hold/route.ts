import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getUserSessionOrNull } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketCategoryId, quantity } = body;

    const session = await getUserSessionOrNull();
    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, error: 'Silakan login terlebih dahulu untuk memesan tiket.' },
        { status: 401 }
      );
    }
    const userId = session.id;

    if (!ticketCategoryId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Kategori tiket dan jumlah kuota wajib diisi.' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    let reservationId = '';
    let expiresAt = '';

    try {
      await client.query('BEGIN');

      // 1. Atomic Update (Replaces FOR UPDATE SKIP LOCKED)
      const updateResult = await client.query(
        `UPDATE ticket_categories 
         SET available_quota = available_quota - $1, updated_at = NOW() 
         WHERE id = $2 AND available_quota >= $1
         RETURNING max_per_transaction`,
        [quantity, ticketCategoryId]
      );

      if (updateResult.rowCount === 0) {
        // Either out of stock or system busy
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'Sistem sedang sibuk atau kuota habis. Silakan coba lagi.' },
          { status: 429 } // Too Many Requests / Conflict
        );
      }

      const categoryData = updateResult.rows[0];

      // Check cross-request limits
      const userHolds = await client.query(
        `SELECT COALESCE(SUM(quantity), 0) as total_held
         FROM ticket_reservations 
         WHERE user_id = $1 AND ticket_category_id = $2 AND status IN ('HOLD', 'CONVERTED', 'PAID')`,
        [userId, ticketCategoryId]
      );
      
      const totalHeld = parseInt(userHolds.rows[0].total_held) + quantity;
      
      if (totalHeld > categoryData.max_per_transaction) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: `Jumlah akumulasi tiket melebihi batas maksimum per user (${categoryData.max_per_transaction} tiket).` },
          { status: 400 }
        );
      }

      // 3. Create Reservation
      expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      reservationId = `hold-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      await client.query(
        `INSERT INTO ticket_reservations (id, user_id, ticket_category_id, quantity, expires_at, status) 
         VALUES ($1, $2, $3, $4, $5, 'HOLD')`,
        [reservationId, userId, ticketCategoryId, quantity, expiresAt]
      );

      await client.query('COMMIT');
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
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
