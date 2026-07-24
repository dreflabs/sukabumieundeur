'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { verifyServerActionAuth } from '@/lib/auth';

export async function addGalleryItem(data: {
  title: string;
  category: string;
  image_url: string;
}) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    // auth verified

    await query(
      `INSERT INTO public.gallery_items (title, category, image_url) 
       VALUES ($1, $2, $3)`,
      [data.title, data.category, data.image_url]
    );

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error: any) {
    console.error('Add Gallery Error:', error);
    return { success: false, error: 'Gagal menambah foto galeri' };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    // auth verified

    await query('DELETE FROM public.gallery_items WHERE id = $1', [id]);

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Gallery Error:', error);
    return { success: false, error: 'Gagal menghapus foto galeri' };
  }
}
