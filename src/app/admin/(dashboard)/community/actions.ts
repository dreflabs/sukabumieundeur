'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { verifyServerActionAuth } from '@/lib/auth';

export async function toggleTopicPin(topicId: string, currentPinStatus: boolean) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    // auth verified

    await query('UPDATE public.forum_topics SET is_pinned = $1 WHERE id = $2', [!currentPinStatus, topicId]);

    revalidatePath('/admin/community');
    revalidatePath('/community');
    return { success: true };
  } catch (error: any) {
    console.error('Toggle Pin Error:', error);
    return { success: false, error: 'Gagal mengubah status pin' };
  }
}

export async function toggleTopicLock(topicId: string, currentLockStatus: boolean) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    // auth verified

    await query('UPDATE public.forum_topics SET is_locked = $1 WHERE id = $2', [!currentLockStatus, topicId]);

    revalidatePath('/admin/community');
    revalidatePath('/community');
    return { success: true };
  } catch (error: any) {
    console.error('Toggle Lock Error:', error);
    return { success: false, error: 'Gagal mengubah status kunci' };
  }
}

export async function deleteTopic(topicId: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    // auth verified

    await query('DELETE FROM public.forum_topics WHERE id = $1', [topicId]);

    revalidatePath('/admin/community');
    revalidatePath('/community');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Topic Error:', error);
    return { success: false, error: 'Gagal menghapus topik' };
  }
}
