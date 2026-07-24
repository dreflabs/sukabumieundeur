"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifyServerActionAuth } from "@/lib/auth";

export async function addMerch(data: { 
  title: string, 
  slug: string, 
  description: string,
  base_price: number,
  category: string,
  stock_quantity: number,
  coverImage: string 
}) {
  try {
    await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
    const imagesArray = data.coverImage ? [data.coverImage] : [];
    
    await query(`
      INSERT INTO public.merch_products (slug, title, description, base_price, category, stock_quantity, images, is_active, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
    `, [data.slug, data.title, data.description, data.base_price, data.category, data.stock_quantity, imagesArray]);
    
    revalidatePath('/admin/merch');
    revalidatePath('/store');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to add merch:", err);
    return { success: false, error: err.message };
  }
}

export async function toggleMerchStatus(id: string, currentStatus: boolean) {
  try {
    await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
    await query(`
      UPDATE public.merch_products 
      SET is_active = $1 
      WHERE id = $2
    `, [!currentStatus, id]);
    
    revalidatePath('/admin/merch');
    revalidatePath('/store');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to toggle merch:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteMerch(id: string) {
  try {
    await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    await query(`DELETE FROM public.merch_products WHERE id = $1`, [id]);
    
    revalidatePath('/admin/merch');
    revalidatePath('/store');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete merch:", err);
    return { success: false, error: err.message };
  }
}
