"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifyServerActionAuth } from "@/lib/auth";

export async function addNews(data: { 
  title: string, 
  slug: string, 
  excerpt: string,
  content: string,
  category: string,
  coverImage: string,
  tags: string,
  status: string
}) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
    const authorId = auth.userId;
    
    // Parse tags string into array, cleanup whitespace
    const tagsArray = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    const publishedAt = data.status === 'PUBLISHED' ? new Date() : null;

    await query(`
      INSERT INTO public.news_articles (slug, title, excerpt, content, cover_image, author_id, category, tags, status, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [data.slug, data.title, data.excerpt, data.content, data.coverImage, authorId, data.category, tagsArray, data.status, publishedAt]);
    
    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to add news article:", err);
    return { success: false, error: err.message };
  }
}

export async function toggleNewsStatus(id: string, currentStatus: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    
    await query(`
      UPDATE public.news_articles 
      SET status = $1 
      WHERE slug = $2
    `, [newStatus, id]); // using slug as ID for simplicity here since it's unique
    
    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to toggle news article:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteNews(slug: string) {
  try {
    const auth = await verifyServerActionAuth(['SUPER_ADMIN', 'MODULE_ADMIN']);
    await query(`DELETE FROM public.news_articles WHERE slug = $1`, [slug]);
    
    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete news article:", err);
    return { success: false, error: err.message };
  }
}
