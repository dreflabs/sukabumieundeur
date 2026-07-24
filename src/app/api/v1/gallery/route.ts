import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const galleryItems = await query(`SELECT * FROM public.gallery_items ORDER BY created_at DESC`);
    return NextResponse.json({ success: true, data: galleryItems });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
