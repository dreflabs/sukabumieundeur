"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { verifyServerActionAuth } from "@/lib/auth";

export async function addArtist(data: { name: string, role: string, imageUrl: string }) {
  try {
    await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
    await query(`
      INSERT INTO public.artists (name, role, image_url, is_active)
      VALUES ($1, $2, $3, true)
    `, [data.name, data.role, data.imageUrl]);
    
    revalidatePath('/admin/artists');
    revalidatePath('/artists');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to add artist:", err);
    return { success: false, error: err.message };
  }
}

export async function toggleArtistStatus(id: string, currentStatus: boolean) {
  try {
    await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
    await query(`
      UPDATE public.artists 
      SET is_active = $1 
      WHERE id = $2
    `, [!currentStatus, id]);
    
    revalidatePath('/admin/artists');
    revalidatePath('/artists');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to toggle artist:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteArtist(id: string) {
  try {
    await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    await query(`DELETE FROM public.artists WHERE id = $1`, [id]);
    
    revalidatePath('/admin/artists');
    revalidatePath('/artists');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete artist:", err);
    return { success: false, error: err.message };
  }
}
