import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MerchProduct } from '@/types/database';
import { z } from 'zod';

const SearchParamsSchema = z.object({
  category: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawCategory = searchParams.get('category');
    const rawSearch = searchParams.get('search');

    const parsed = SearchParamsSchema.safeParse({
      category: rawCategory,
      search: rawSearch,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid search parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { category, search } = parsed.data;
    let products: MerchProduct[] = [];

    if (category) {
      products = await query<MerchProduct>(
        `SELECT * FROM merch_products WHERE is_active = true AND LOWER(category) = $1 ORDER BY created_at DESC`,
        [category.toLowerCase()]
      );
    } else if (search) {
      products = await query<MerchProduct>(
        `SELECT * FROM merch_products WHERE is_active = true AND LOWER(title) LIKE $1 ORDER BY created_at DESC`,
        [`%${search.toLowerCase()}%`]
      );
    } else {
      products = await query<MerchProduct>(
        `SELECT * FROM merch_products WHERE is_active = true ORDER BY created_at DESC`
      );
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error: unknown) {
    console.error('Error fetching merchandise products:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil katalog merchandise.' },
      { status: 500 }
    );
  }
}
