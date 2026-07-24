import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MerchProduct } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const products = await query<MerchProduct>(
      `SELECT * FROM merch_products WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    let product: MerchProduct | null = null;
    let variants = [];

    if (products.length > 0) {
      product = products[0];
      variants = await query(
        `SELECT * FROM merch_variants WHERE product_id = $1 ORDER BY size ASC`,
        [product.id]
      );
    } else {
      // No mock data in production. Return 404 explicitly.
      return NextResponse.json(
        { success: false, message: 'Produk tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        product: product,
        variants: variants
      }
    });
  } catch (error: any) {
    console.error('Error fetching merchandise detail:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail produk.' },
      { status: 500 }
    );
  }
}
