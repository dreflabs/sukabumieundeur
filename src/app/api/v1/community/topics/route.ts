import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const topics = await query(
      `SELECT t.*, p.username as author_name FROM forum_topics t LEFT JOIN profiles p ON t.author_id = p.id ORDER BY t.is_pinned DESC, t.created_at DESC`
    );

    let data = topics;

    if (data.length === 0) {
      data = [];
    }

    return NextResponse.json({ success: true, data: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil topik forum.' }, { status: 500 });
  }
}
