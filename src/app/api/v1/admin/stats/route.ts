import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const stats = {
      totalRevenue: 142500000,
      ticketsSold: 875,
      merchOrders: 134,
      totalUsers: 1420,
      activeEvent: 'Sukabumi Eundeur Fest 2026',
      quotaRemaining: 625,
      systemStatus: '100% HEALTHY (Self-Hosted VPS)'
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil statistik admin.' },
      { status: 500 }
    );
  }
}
