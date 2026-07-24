'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { verifyServerActionAuth } from '@/lib/auth';

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN']);
    // auth verified

    await query('UPDATE public.profiles SET role = $1 WHERE id = $2', [newRole, userId]);

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Update Role Error:', error);
    return { success: false, error: error.message || 'Gagal mengubah role' };
  }
}

export async function deleteUser(userId: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN']);
    // auth verified

    await query('DELETE FROM public.profiles WHERE id = $1', [userId]);

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Delete User Error:', error);
    return { success: false, error: 'Gagal menghapus pengguna (mungkin ada relasi order/tiket).' };
  }
}
