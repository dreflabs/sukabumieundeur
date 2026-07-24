import { query } from '@/lib/db';
import NewsClient from './NewsClient';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'News & Updates - Sukabumi Eundeur',
  description: 'Baca berita, ulasan, dan panduan terbaru dari komunitas Sukabumi Eundeur.',
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  try {
    const params = await searchParams;
    const categoryFilter = typeof params.category === 'string' ? params.category : null;
    
    // Pagination parameters
    const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
    const currentPage = isNaN(page) || page < 1 ? 1 : page;
    const limit = 12; // Load 12 articles per page
    const offset = (currentPage - 1) * limit;

    let sql = `
      SELECT n.*, p.full_name as author_name 
      FROM public.news_articles n
      LEFT JOIN public.profiles p ON n.author_id = p.id
      WHERE n.status = 'PUBLISHED'
    `;
    const sqlParams: any[] = [];
    let paramIndex = 1;
    
    if (categoryFilter && categoryFilter !== 'LATEST') {
      sql += ` AND n.category = $${paramIndex}`;
      sqlParams.push(categoryFilter.toUpperCase());
      paramIndex++;
    }
    
    // Check total count for pagination
    const countSql = sql.replace('SELECT n.*, p.full_name as author_name', 'SELECT COUNT(*) as total');
    const countResult = await query<any>(countSql, sqlParams);
    const totalArticles = parseInt(countResult[0]?.total || '0', 10);
    const hasMore = totalArticles > offset + limit;

    // Apply ordering and pagination
    sql += ` ORDER BY n.published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    sqlParams.push(limit, offset);

    const rows = await query(sql, sqlParams);
    
    // Format data for frontend
    const articles = rows.map((row: any) => {
      const d = new Date(row.published_at);
      return {
        id: row.slug, // Use slug for routing
        title: row.title,
        category: row.category,
        date: `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'long' }).toUpperCase()} ${d.getFullYear()}`,
        image: row.cover_image || 'https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=800&auto=format&fit=crop',
        excerpt: row.excerpt,
        authorName: row.author_name || 'Admin',
      };
    });

    return <NewsClient 
      articles={articles} 
      activeCategory={categoryFilter || 'LATEST'} 
      currentPage={currentPage}
      hasMore={hasMore}
    />;
  } catch (error) {
    console.error("Error fetching news:", error);
    return <NewsClient articles={[]} activeCategory="LATEST" currentPage={1} hasMore={false} />;
  }
}
