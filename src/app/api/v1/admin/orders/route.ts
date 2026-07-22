import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const orders = [
      {
        id: 'ord-1001',
        order_number: 'ORD-20260815-001',
        user_name: 'Budi Metalhead',
        item_summary: 'MOSHPIT VIP PASS (2 Tiket)',
        total_amount: 300000,
        status: 'PAID',
        payment_method: 'Midtrans QRIS',
        created_at: new Date().toISOString()
      },
      {
        id: 'ord-1002',
        order_number: 'ORD-20260815-002',
        user_name: 'Rudi Underground',
        item_summary: 'Official T-Shirt 2026 (Size L)',
        total_amount: 185000,
        status: 'PAID',
        payment_method: 'BCA Virtual Account',
        created_at: new Date().toISOString()
      }
    ];

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data transaksi.' },
      { status: 500 }
    );
  }
}
