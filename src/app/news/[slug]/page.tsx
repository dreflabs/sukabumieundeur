export const dynamic = 'force-dynamic';
import { query } from '@/lib/db';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const rows = await query<any>(
    `SELECT title, excerpt, cover_image FROM public.news_articles WHERE slug = $1 AND status = 'PUBLISHED'`, 
    [slug]
  );

  if (!rows || rows.length === 0) {
    return { title: 'Not Found' };
  }

  const article = rows[0];

  return {
    title: `${article.title} - Sukabumi Eundeur News`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.cover_image ? [article.cover_image] : [],
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const rows = await query<any>(`
    SELECT n.*, p.full_name as author_name 
    FROM public.news_articles n
    LEFT JOIN public.profiles p ON n.author_id = p.id
    WHERE n.slug = $1 AND n.status = 'PUBLISHED'
  `, [slug]);

  if (!rows || rows.length === 0) {
    notFound();
  }

  const articleRaw = rows[0];
  const d = new Date(articleRaw.published_at);
  
  const article = {
    id: articleRaw.slug,
    title: articleRaw.title,
    category: articleRaw.category,
    date: `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'long' }).toUpperCase()} ${d.getFullYear()}`,
    image: articleRaw.cover_image || 'https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=2940&auto=format&fit=crop',
    excerpt: articleRaw.excerpt,
    content: articleRaw.content,
    authorName: articleRaw.author_name || 'Eundeur Editorial',
    isoDate: d.toISOString(),
    tags: articleRaw.tags || [],
  };

  // Fetch 3 related articles
  const relatedRows = await query(`
    SELECT slug, title, category, published_at, cover_image 
    FROM public.news_articles 
    WHERE category = $1 AND slug != $2 AND status = 'PUBLISHED'
    ORDER BY published_at DESC LIMIT 3
  `, [article.category, article.id]);

  const relatedArticles = relatedRows.map((row: any) => {
    const rd = new Date(row.published_at);
    return {
      id: row.slug,
      title: row.title,
      category: row.category,
      date: `${rd.getDate()} ${rd.toLocaleString('id-ID', { month: 'short' }).toUpperCase()} ${rd.getFullYear()}`,
      image: row.cover_image || 'https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=800&auto=format&fit=crop',
    }
  });

  // Generate JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.image],
    datePublished: article.isoDate,
    dateModified: article.isoDate,
    author: [{
        '@type': 'Person',
        name: article.authorName,
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient article={article} relatedArticles={relatedArticles} />
    </>
  );
}
