'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Article {
  id: string; // slug
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  authorName?: string;
}

interface NewsClientProps {
  articles: Article[];
  activeCategory: string;
  currentPage: number;
  hasMore: boolean;
}

const CATEGORIES = ['LATEST', 'FESTIVAL', 'ARTIST', 'COMMUNITY', 'NEWS'];

export default function NewsClient({ articles, activeCategory, currentPage, hasMore }: NewsClientProps) {
  const router = useRouter();
  
  // If on page 1, the first article is featured
  const featured = (currentPage === 1 && articles.length > 0) ? articles[0] : null;
  const list = (currentPage === 1 && articles.length > 1) ? articles.slice(1) : articles;

  const handleCategoryClick = (cat: string) => {
    if (cat === 'LATEST') {
      router.push('/news');
    } else {
      router.push(`/news?category=${cat}`);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('page', nextPage.toString());
    router.push(`/news?${currentParams.toString()}`);
  };

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    const prevPage = currentPage - 1;
    const currentParams = new URLSearchParams(window.location.search);
    if (prevPage === 1) {
      currentParams.delete('page');
    } else {
      currentParams.set('page', prevPage.toString());
    }
    router.push(`/news?${currentParams.toString()}`);
  };

  return (
    <main className="min-h-screen bg-background text-white pt-24 pb-20 selection:bg-brand selection:text-black">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-8 md:w-12 h-1 bg-brand"></div>
            <span className="font-inter font-bold text-sm md:text-base tracking-[0.3em] text-brand uppercase">
              THE TRANSMISSION
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl lg:text-9xl font-outfit font-black uppercase tracking-tighter leading-[0.85]"
          >
            NEWS &<br />
            <span className="text-transparent [-webkit-text-stroke:1px_white]">UPDATES</span>
          </motion.h1>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-12 border-b border-white/10 pb-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.05) }}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 font-inter font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
                activeCategory === cat || (activeCategory === 'LATEST' && cat === 'LATEST')
                  ? 'bg-brand text-black' 
                  : 'bg-transparent text-gray-500 border border-white/10 hover:border-brand hover:text-brand'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="py-20 text-center font-inter text-gray-500">
            No articles found in this category.
          </div>
        ) : (
          <>
            {/* Featured Article (Only on page 1) */}
            {featured && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-16 group"
              >
                <Link href={`/news/${featured.id}`} className="block relative aspect-video md:aspect-[21/9] w-full overflow-hidden bg-black mb-6">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-brand px-4 py-2">
                    <span className="font-inter font-bold text-black text-xs md:text-sm tracking-widest uppercase">
                      {featured.category}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="md:w-2/3">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-inter text-gray-400 text-xs tracking-widest">{featured.date}</span>
                      <span className="w-1 h-1 rounded-full bg-brand"></span>
                      <span className="font-inter text-brand text-xs tracking-widest">{featured.authorName}</span>
                    </div>
                    <Link href={`/news/${featured.id}`}>
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-outfit font-black uppercase tracking-tight leading-[0.9] mb-4 group-hover:text-brand transition-colors">
                        {featured.title}
                      </h2>
                    </Link>
                    <p className="font-inter text-gray-400 text-sm md:text-base max-w-2xl">
                      {featured.excerpt}
                    </p>
                  </div>
                  <Link 
                    href={`/news/${featured.id}`}
                    className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 group-hover:bg-brand group-hover:border-brand group-hover:text-black transition-all duration-300"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Grid Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-20">
              {list.map((article, idx) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="group flex flex-col"
                >
                  <Link href={`/news/${article.id}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-black mb-6">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 bg-white text-black px-3 py-1">
                      <span className="font-inter font-bold text-xs tracking-widest uppercase">
                        {article.category}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="flex-grow flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-inter text-gray-500 text-xs tracking-widest">{article.date}</span>
                    </div>
                    <Link href={`/news/${article.id}`}>
                      <h3 className="text-xl md:text-2xl font-outfit font-black uppercase tracking-tight leading-none mb-3 group-hover:text-brand transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="font-inter text-gray-400 text-xs md:text-sm line-clamp-2 mt-auto">
                      {article.excerpt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-white/10 pt-12">
              <button 
                onClick={() => handlePrevPage()}
                disabled={currentPage <= 1}
                className="px-6 py-3 border border-white/20 font-inter font-bold text-xs tracking-widest uppercase hover:bg-brand hover:text-black hover:border-brand shadow-brutal hover:shadow-brutal-hover rounded-none transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white disabled:shadow-none"
              >
                PREV PAGE
              </button>
              
              <span className="font-inter font-bold text-gray-500 text-xs tracking-widest">PAGE {currentPage}</span>
              
              <button 
                onClick={() => handleLoadMore()}
                disabled={!hasMore}
                className="px-6 py-3 border border-white/20 font-inter font-bold text-xs tracking-widest uppercase hover:bg-brand hover:text-black hover:border-brand shadow-brutal hover:shadow-brutal-hover rounded-none transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white disabled:shadow-none"
              >
                NEXT PAGE
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
