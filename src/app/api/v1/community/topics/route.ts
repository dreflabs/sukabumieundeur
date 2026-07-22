import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const topics = await query(
      `SELECT t.*, p.username as author_name FROM forum_topics t LEFT JOIN profiles p ON t.author_id = p.id ORDER BY t.is_pinned DESC, t.created_at DESC`
    );

    let data = topics;

    if (data.length === 0) {
      data = [
        {
          id: 'topic-1',
          slug: 'persiapan-moshpit-safety-guide-sukabumi-eundeur-fest-2026',
          title: 'Persiapan & Moshpit Safety Guide Sukabumi Eundeur Fest 2026',
          author_name: 'Metalhead_Skbm',
          category: 'Tips & Etika',
          is_pinned: true,
          is_locked: false,
          posts_count: 34,
          created_at: new Date().toISOString()
        },
        {
          id: 'topic-2',
          slug: 'rekomendasi-band-local-heroes-sukabumi-yang-wajib-tonton',
          title: 'Rekomendasi Band Local Heroes Sukabumi yang Wajib Tonton!',
          author_name: 'Underground_Addict',
          category: 'Diskusi Musik',
          is_pinned: false,
          is_locked: false,
          posts_count: 19,
          created_at: new Date().toISOString()
        }
      ];
    }

    return NextResponse.json({ success: true, data: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil topik forum.' }, { status: 500 });
  }
}
