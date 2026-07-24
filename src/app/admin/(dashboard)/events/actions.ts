"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifyServerActionAuth } from "@/lib/auth";

export async function addEvent(data: { 
  title: string, 
  slug: string, 
  description: string, 
  venue: string, 
  city: string, 
  startDate: string, 
  endDate: string, 
  bannerUrl: string 
}) {
  try {
    await verifyServerActionAuth(['SUPER_ADMIN', 'ORGANISER']);
    await query(`
      INSERT INTO public.events (slug, title, description, venue, city, start_date, end_date, banner_url, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
    `, [data.slug, data.title, data.description, data.venue, data.city, data.startDate, data.endDate, data.bannerUrl]);
    
    revalidatePath('/admin/events');
    revalidatePath('/events');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to add event:", err);
    return { success: false, error: err.message };
  }
}

export async function toggleEventStatus(id: string, currentStatus: boolean) {
  try {
    await verifyServerActionAuth(['SUPER_ADMIN', 'ORGANISER']);
    await query(`
      UPDATE public.events 
      SET is_active = $1 
      WHERE id = $2
    `, [!currentStatus, id]);
    
    revalidatePath('/admin/events');
    revalidatePath('/events');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to toggle event:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteEvent(id: string) {
  try {
    await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    await query(`DELETE FROM public.events WHERE id = $1`, [id]);
    
    revalidatePath('/admin/events');
    revalidatePath('/events');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete event:", err);
    return { success: false, error: err.message };
  }
}
