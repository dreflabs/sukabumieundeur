import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdminRole } from '@/lib/requireAdmin';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(['SUPER_ADMIN', 'ORGANISER']);
    if (!auth.success) return auth.response;

    const [revenueRes, ticketsRes, usersRes, activeEventRes] = await Promise.all([
      query<{total: string}>('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status = $1', ['PAID']),
      query<{count: string}>('SELECT COUNT(*) as count FROM tickets WHERE status = $1', ['ISSUED']),
      query<{count: string}>('SELECT COUNT(*) as count FROM profiles'),
      query<{title: string, id: string}>('SELECT title, id FROM events WHERE is_active = true ORDER BY start_date ASC LIMIT 1'),
    ]);

    const stats = {
      totalRevenue: Number(revenueRes[0]?.total || 0),
      ticketsSold: Number(ticketsRes[0]?.count || 0),
      totalUsers: Number(usersRes[0]?.count || 0),
      activeEvent: activeEventRes[0]?.title || 'Belum ada event aktif',
      systemStatus: 'OPERATIONAL'
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil statistik admin.' },
      { status: 500 }
    );
  }
}
