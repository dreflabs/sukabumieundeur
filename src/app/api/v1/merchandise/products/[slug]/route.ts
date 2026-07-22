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
      // Mock fallback detail for local dev UI preview
      product = {
        id: 'p-101',
        slug: slug,
        title: slug.replace(/-/g, ' ').toUpperCase(),
        description: 'Official Heavy Metal Merchandise Sukabumi Eundeur Fest 2026. Cotton Combed 24s Heavy Duty Plastisol Print.',
        base_price: 185000,
        category: 'T-Shirt',
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      variants = [
        { id: 'v-1', size: 'S', color: 'Black', stock: 15, sku: 'TSH-BLK-S' },
        { id: 'v-2', size: 'M', color: 'Black', stock: 42, sku: 'TSH-BLK-M' },
        { id: 'v-3', size: 'L', color: 'Black', stock: 30, sku: 'TSH-BLK-L' },
        { id: 'v-4', size: 'XL', color: 'Black', stock: 18, sku: 'TSH-BLK-XL' },
        { id: 'v-5', size: 'XXL', color: 'Black', stock: 5, sku: 'TSH-BLK-XXL' }
      ];
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
