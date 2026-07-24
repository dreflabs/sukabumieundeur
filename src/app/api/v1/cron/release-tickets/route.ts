import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query<{total_quantity: string}>(
      `WITH updated_reservations AS (
        UPDATE ticket_reservations 
        SET status = 'EXPIRED' 
        WHERE expires_at < NOW() AND status = 'HOLD'
        RETURNING ticket_category_id, quantity
      ),
      aggregated AS (
        SELECT ticket_category_id, SUM(quantity) as total_quantity
        FROM updated_reservations
        GROUP BY ticket_category_id
      )
      UPDATE ticket_categories tc
      SET available_quota = tc.available_quota + a.total_quantity, updated_at = NOW()
      FROM aggregated a
      WHERE tc.id = a.ticket_category_id
      RETURNING a.total_quantity;`
    );

    let releasedCount = 0;
    if (result && result.length > 0) {
      releasedCount = result.reduce((acc, row) => acc + parseInt(row.total_quantity, 10), 0);
    }

    if (releasedCount === 0) {
      return NextResponse.json({ success: true, message: 'No zombie quotas found.', releasedCount: 0 });
    }

    console.log(`[CRON] Reclaimed ${releasedCount} zombie ticket quotas.`);

    return NextResponse.json({ 
      success: true, 
      message: 'Zombie quotas released successfully.',
      releasedCount 
    });
  } catch (error) {
    console.error('Error releasing zombie quotas:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
