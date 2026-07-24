import { MetadataRoute } from 'next';
import { query } from '@/lib/db';

// Force dynamic: never pre-render at build time — DB is not available during Docker build
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sukabumieundeurindonesia.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tickets`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/artists`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/store`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  // Fetch published articles — gracefully skip if DB is unreachable
  let newsUrls: MetadataRoute.Sitemap = [];
  try {
    const rows = await query<{ slug: string; published_at: string }>(`
      SELECT slug, published_at 
      FROM public.news_articles 
      WHERE status = 'PUBLISHED'
      ORDER BY published_at DESC
    `);
    newsUrls = rows.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(article.published_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // DB not reachable — return static sitemap only
  }

  // Fetch store products — gracefully skip if DB is unreachable
  let merchUrls: MetadataRoute.Sitemap = [];
  try {
    const merchRows = await query<{ slug: string; updated_at: string }>(`
      SELECT slug, updated_at
      FROM public.merch_products
      WHERE is_active = true
    `);
    merchUrls = merchRows.map((product) => ({
      url: `${baseUrl}/store/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // DB not reachable — return static sitemap only
  }

  return [...staticRoutes, ...newsUrls, ...merchUrls];
}
