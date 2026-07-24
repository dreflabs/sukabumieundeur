import { query } from "@/lib/db";
import MerchAdminClient from "./MerchAdminClient";
import { requireAdminRole } from '@/lib/requireAdmin';

export const revalidate = 0;

export default async function MerchAdminPage() {
  const auth = await requireAdminRole(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
  if (!auth.success) return <div>Unauthorized</div>;

  const rows = await query(`
    SELECT id, title, slug, description, base_price, category, 
           (SELECT COALESCE(SUM(stock), 0) FROM public.merch_variants WHERE product_id = public.merch_products.id) as stock_quantity, 
           images, is_active 
    FROM public.merch_products 
    ORDER BY created_at DESC
  `);
  
  const products = rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    base_price: Number(row.base_price),
    category: row.category,
    stock_quantity: row.stock_quantity,
    image: row.images && row.images.length > 0 ? row.images[0] : '',
    is_active: row.is_active
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-outfit font-black uppercase tracking-tighter text-white mb-2">MERCHANDISE CMS</h1>
        <p className="text-gray-400 font-inter text-sm">Kelola katalog produk, stok, dan harga E-Commerce.</p>
      </div>
      <MerchAdminClient initialProducts={products} />
    </div>
  );
}
