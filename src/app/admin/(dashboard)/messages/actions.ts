'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { verifyServerActionAuth } from '@/lib/auth';

export async function markMessageRead(id: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    // auth verified

    await query('UPDATE public.contact_messages SET is_read = TRUE WHERE id = $1', [id]);

    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    console.error('Mark Message Read Error:', error);
    return { success: false, error: 'Gagal menandai pesan' };
  }
}

export async function deleteMessage(id: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    // auth verified

    await query('DELETE FROM public.contact_messages WHERE id = $1', [id]);

    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Message Error:', error);
    return { success: false, error: 'Gagal menghapus pesan' };
  }
}
