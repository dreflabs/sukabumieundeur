'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { verifyServerActionAuth } from '@/lib/auth';

export async function saveSetting(key: string, value: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN']);
    // auth verified

    await query(
      `INSERT INTO public.site_settings (key, value) 
       VALUES ($1, $2) 
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key, value]
    );

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Save Setting Error:', error);
    return { success: false, error: 'Gagal menyimpan pengaturan' };
  }
}

export async function deleteSetting(key: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN']);
    // auth verified

    await query('DELETE FROM public.site_settings WHERE key = $1', [key]);

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Setting Error:', error);
    return { success: false, error: 'Gagal menghapus pengaturan' };
  }
}
