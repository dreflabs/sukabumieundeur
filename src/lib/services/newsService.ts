import { query } from '@/lib/db';
import { NewsArticle } from '@/types/database';

export async function getLatestNews(limit: number = 3): Promise<NewsArticle[]> {
  try {
    const rows = await query<any>(`
      SELECT id, slug, title, published_at, cover_image, status 
      FROM public.news_articles 
      WHERE status = 'PUBLISHED'
      ORDER BY published_at DESC LIMIT $1
    `, [limit]);

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      published_at: row.published_at,
      cover_image: row.cover_image,
      status: row.status,
    }));
  } catch {
    // DB not reachable (e.g. Docker build time) — return empty array
    return [];
  }
}
