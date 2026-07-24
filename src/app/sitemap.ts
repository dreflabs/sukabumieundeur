import { MetadataRoute } from 'next';
import { query } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eundeur.com'; // Change to actual production URL later

  // Fetch all published articles
  const rows = await query<any>(`
    SELECT slug, published_at 
    FROM public.news_articles 
    WHERE status = 'PUBLISHED'
    ORDER BY published_at DESC
  `);

  const newsUrls = rows.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch store products
  const merchRows = await query<any>(`
    SELECT slug, updated_at
    FROM public.merch_products
    WHERE is_active = true
  `);

  const merchUrls = merchRows.map((product) => ({
    url: `${baseUrl}/store/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tickets`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/artists`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/store`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...newsUrls,
    ...merchUrls,
  ];
}
