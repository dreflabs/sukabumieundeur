import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdminRole } from '@/lib/requireAdmin';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(['SUPER_ADMIN', 'ORGANISER']);
    if (!auth.success) return auth.response;

    const orders = await query(`
      SELECT 
        o.id,
        o.order_number,
        p.full_name as user_name,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      LEFT JOIN profiles p ON o.user_id = p.id
      ORDER BY o.created_at DESC
      LIMIT 50
    `);

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data transaksi.' },
      { status: 500 }
    );
  }
}
