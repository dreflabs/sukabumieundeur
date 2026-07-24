export const dynamic = 'force-dynamic';
import { query } from "@/lib/db";
import NewsAdminClient from "./NewsAdminClient";
import { requireAdminRole } from "@/lib/requireAdmin";

export const revalidate = 0;

export default async function AdminNewsPage() {
  const auth = await requireAdminRole(['SUPER_ADMIN', 'MODULE_ADMIN', 'ORGANISER']);
  if (!auth.success) return <div>Unauthorized</div>;

  try {
    // Fetch news
    const rows = await query(`SELECT * FROM public.news_articles ORDER BY created_at DESC`);
    
    const articles = rows.map((row: any) => ({
      id: row.slug, // use slug as ID
      title: row.title,
      slug: row.slug,
      category: row.category,
      coverImage: row.cover_image,
      excerpt: row.excerpt,
      status: row.status, // PUBLISHED or DRAFT
    }));

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-outfit font-black text-white uppercase tracking-tighter">NEWS DESK</h1>
            <p className="text-xs text-gray-500 font-inter mt-1 tracking-widest uppercase">Publish Announcements & Articles</p>
          </div>
        </div>

        <NewsAdminClient initialArticles={articles} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching news for admin:", error);
    return <div className="text-red-500">Failed to load news data. Ensure database is running.</div>;
  }
}
