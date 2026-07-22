import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MerchProduct } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

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

    // Fallback mock merchandise items if database table is empty
    if (products.length === 0) {
      const mockProducts: MerchProduct[] = [
        {
          id: 'p-101',
          slug: 'official-fest-tshirt-2026',
          title: 'Official Festival T-Shirt 2026',
          description: 'Official Heavy Metal Fest T-Shirt 2026 dengan bahan Cotton Combed 24s sablon Plastisol Heavy Duty.',
          base_price: 185000,
          category: 'T-Shirt',
          images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'p-102',
          slug: 'moshpit-zipper-hoodie',
          title: 'Moshpit Heavy Zipper Hoodie',
          description: 'Heavyweight Fleece 330gsm Zip-Up Hoodie dengan bordir logo Sukabumi Eundeur di dada.',
          base_price: 350000,
          category: 'Hoodie',
          images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'p-103',
          slug: 'underground-embroidered-snapback',
          title: 'Underground Embroidered Snapback',
          description: 'Topi Snapback 6-panel dengan bordir high density logo Sukabumi Eundeur.',
          base_price: 120000,
          category: 'Accessories',
          images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'p-104',
          slug: 'metalhead-lanyard-keychain-set',
          title: 'Metalhead Lanyard & Keychain Set',
          description: 'Lanyard motif festival & gantungan kunci akrilik emboss edisi terbatas 2026.',
          base_price: 55000,
          category: 'Accessories',
          images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      if (category) {
        return NextResponse.json({
          success: true,
          data: mockProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
        });
      }

      return NextResponse.json({ success: true, data: mockProducts });
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error('Error fetching merchandise products:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil katalog merchandise.' },
      { status: 500 }
    );
  }
}
