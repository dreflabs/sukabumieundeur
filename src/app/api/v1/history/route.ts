import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const historyData = await query(`SELECT * FROM public.history_events ORDER BY year DESC`);
    return NextResponse.json({ success: true, data: historyData });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
