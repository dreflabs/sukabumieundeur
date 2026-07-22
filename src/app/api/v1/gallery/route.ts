import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const galleryItems = [
    {
      id: 'gal-1',
      title: 'Crowd Moshpit Surajaya 2025',
      category: 'Stage Photo',
      image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800'
    },
    {
      id: 'gal-2',
      title: 'Guitarist Shredding Action',
      category: 'Performance',
      image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800'
    },
    {
      id: 'gal-3',
      title: 'Festival Stage Lighting',
      category: 'Stage',
      image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800'
    },
    {
      id: 'gal-4',
      title: 'Metalheads High Energy',
      category: 'Community',
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800'
    }
  ];

  return NextResponse.json({ success: true, data: galleryItems });
}
