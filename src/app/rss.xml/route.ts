import { query } from '@/lib/db';

// Force dynamic: never pre-render at build time — DB is not available during Docker build
export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sukabumieundeurindonesia.com';

  let rows: any[] = [];
  try {
    // Fetch latest 50 published articles for the RSS feed
    rows = await query(`
      SELECT n.*, p.full_name as author_name 
      FROM public.news_articles n
      LEFT JOIN public.profiles p ON n.author_id = p.id
      WHERE n.status = 'PUBLISHED'
      ORDER BY n.published_at DESC LIMIT 50
    `);
  } catch {
    // DB not reachable — return empty feed
  }

  const itemsXml = rows.map((article: any) => {
    return `
      <item>
        <title><![CDATA[${article.title}]]></title>
        <link>${baseUrl}/news/${article.slug}</link>
        <guid isPermaLink="true">${baseUrl}/news/${article.slug}</guid>
        <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
        <description><![CDATA[${article.excerpt}]]></description>
        <author>${article.author_name || 'Eundeur Editorial'}</author>
        ${article.category ? `<category>${article.category}</category>` : ''}
      </item>
    `;
  }).join('');

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Sukabumi Eundeur News</title>
        <link>${baseUrl}</link>
        <description>Berita, ulasan, dan panduan terbaru dari komunitas Sukabumi Eundeur.</description>
        <language>id-ID</language>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
        ${itemsXml}
      </channel>
    </rss>`;

  return new Response(feedXml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
