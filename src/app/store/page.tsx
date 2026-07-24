export const dynamic = 'force-dynamic';
import { query } from '@/lib/db';
import StoreClient from './StoreClient';

export const revalidate = 0; // Disable caching for now to always fetch fresh data

export default async function StorePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  try {
    const params = await searchParams;
    const categoryFilter = typeof params.category === 'string' ? params.category : null;

    let sql = `SELECT * FROM public.merch_products WHERE is_active = true`;
    const sqlParams: any[] = [];
    
    if (categoryFilter && categoryFilter !== 'ALL') {
      sql += ` AND category = $1`;
      sqlParams.push(categoryFilter.toUpperCase());
    }
    
    sql += ` ORDER BY created_at DESC`;

    const rows = await query(sql, sqlParams);
    
    // Format data for frontend
    const products = rows.map((row: any) => ({
      id: row.slug || row.id.toString(),
      name: row.title,
      price: Number(row.base_price),
      formattedPrice: `IDR ${Number(row.base_price).toLocaleString('id-ID')}`,
      category: row.category,
      image: row.images && row.images.length > 0 ? row.images[0] : 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
      status: row.stock_quantity > 0 ? (row.stock_quantity <= 5 ? 'LOW STOCK' : 'AVAILABLE') : 'SOLD OUT'
    }));

    return <StoreClient products={products} activeCategory={categoryFilter || 'ALL'} />;
  } catch (error) {
    console.error("Error fetching products:", error);
    // If DB fails (e.g. docker is off), pass empty array or handle error
    return <StoreClient products={[]} activeCategory="ALL" />;
  }
}
