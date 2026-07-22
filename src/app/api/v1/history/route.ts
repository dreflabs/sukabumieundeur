import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const historyData = [
    {
      year: '2025',
      title: 'Sukabumi Eundeur Vol. 4 — Lembah Guram Heavyfest',
      date: '17 Agustus 2025',
      venue: 'Stadion Surajaya Sukabumi',
      attendees: '3.500+ Metalheads',
      headliners: ['Burgerkill', 'Deadsquad', 'Seringai', 'Local Bands'],
      aftermovie_url: 'https://youtube.com',
      cover: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800'
    },
    {
      year: '2024',
      title: 'Sukabumi Eundeur Vol. 3 — Underground Resurgence',
      date: '20 Agustus 2024',
      venue: 'Lap. Secapa Polri Sukabumi',
      attendees: '2.800+ Metalheads',
      headliners: ['Revenge The Fate', 'JASAD', 'Gomora'],
      aftermovie_url: 'https://youtube.com',
      cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800'
    }
  ];

  return NextResponse.json({ success: true, data: historyData });
}
