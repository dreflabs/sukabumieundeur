import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let articles = [];

    if (category) {
      articles = await query(
        `SELECT * FROM news_articles WHERE status = 'PUBLISHED' AND LOWER(category) = $1 ORDER BY published_at DESC`,
        [category.toLowerCase()]
      );
    } else {
      articles = await query(
        `SELECT * FROM news_articles WHERE status = 'PUBLISHED' ORDER BY published_at DESC`
      );
    }

    if (articles.length === 0) {
      articles = [
        {
          id: 'news-1',
          slug: 'lineup-fase-1-sukabumi-eundeur-fest-2026-resmi-diumumkan',
          title: 'Lineup Fase 1 Sukabumi Eundeur Fest 2026 Resmi Diumumkan!',
          excerpt: 'Deretan band heavy metal dan deathcore papan atas tanah air dipastikan bakal membakar panggung utama Surajaya.',
          content: 'Festival ekosistem musik terbesar di Sukabumi kembali hadir dengan skala lebih besar. Penjualan tiket fase Presale resmi dibuka.',
          cover_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800',
          category: 'Event',
          published_at: new Date().toISOString()
        },
        {
          id: 'news-2',
          slug: 'gerakan-komunitas-underground-sukabumi-rilis-album-kompilasi',
          title: 'Gerakan Komunitas Underground Sukabumi Rilis Album Kompilasi',
          excerpt: '12 Band lokal lintas genre bersatu dalam kompilasi fisik dan digital bertajuk Suara Dari Lembah Guram.',
          content: 'Album kompilasi ini menjadi bukti eksistensi kebudayaan underground Sukabumi yang terus bertumbuh secara mandiri.',
          cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800',
          category: 'Skena',
          published_at: new Date().toISOString()
        }
      ];
    }

    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Gagal mengambil berita.' }, { status: 500 });
  }
}
