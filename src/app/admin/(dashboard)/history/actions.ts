'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { verifyServerActionAuth } from '@/lib/auth';

export async function addHistoryEvent(data: {
  year: string;
  title: string;
  date: string;
  venue: string;
  attendees: string;
  headliners: string;
  cover: string;
  aftermovie_url?: string;
}) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    // auth verified

    const headlinersArray = data.headliners.split(',').map(h => h.trim()).filter(Boolean);

    await query(
      `INSERT INTO public.history_events (year, title, date, venue, attendees, headliners, cover, aftermovie_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [data.year, data.title, data.date, data.venue, data.attendees, headlinersArray, data.cover, data.aftermovie_url || null]
    );

    revalidatePath('/admin/history');
    revalidatePath('/history');
    return { success: true };
  } catch (error: any) {
    console.error('Add History Error:', error);
    return { success: false, error: 'Gagal menambah riwayat event' };
  }
}

export async function deleteHistoryEvent(id: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    // auth verified

    await query('DELETE FROM public.history_events WHERE id = $1', [id]);

    revalidatePath('/admin/history');
    revalidatePath('/history');
    return { success: true };
  } catch (error: any) {
    console.error('Delete History Error:', error);
    return { success: false, error: 'Gagal menghapus riwayat event' };
  }
}
