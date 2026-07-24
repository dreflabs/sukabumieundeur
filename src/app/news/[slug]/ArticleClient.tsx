'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Bookmark, Check, ArrowRight } from 'lucide-react';

interface RelatedArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

interface ArticleClientProps {
  article: {
    id: string;
    title: string;
    category: string;
    date: string;
    image: string;
    excerpt: string;
    content: string;
    authorName: string;
    tags?: string[];
  };
  relatedArticles: RelatedArticle[];
}

export default function ArticleClient({ article, relatedArticles }: ArticleClientProps) {
  const [readingTime, setReadingTime] = useState(3);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Calculate reading time (avg 200 words per minute)
    const text = article.content.replace(/<[^>]*>?/gm, '');
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    setReadingTime(time === 0 ? 1 : time);
  }, [article.content]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      alert("Terima kasih telah berlangganan The Transmission!");
      setEmail('');
    }
  };

  return (
    <main className="min-h-screen bg-background text-white pt-24 pb-20 selection:bg-brand selection:text-black">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/news" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand transition-colors font-inter text-xs tracking-widest uppercase font-bold">
            <ArrowLeft className="w-4 h-4" /> BACK TO NEWS
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <span className="bg-brand text-black px-3 py-1 font-inter font-bold text-[10px] tracking-widest uppercase">
              {article.category}
            </span>
            <span className="font-inter text-gray-400 text-xs tracking-widest uppercase">{article.date}</span>
            <span className="font-inter text-brand text-xs tracking-widest uppercase font-bold">{readingTime} MIN READ</span>
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2 ml-4 border-l border-white/20 pl-4">
                {article.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-inter text-gray-400 tracking-widest uppercase hover:text-white transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-outfit font-black uppercase tracking-tight leading-[0.9] mb-8"
          >
            {article.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between border-t border-b border-white/10 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-outfit font-black text-brand">
                {article.authorName.charAt(0)}
              </div>
              <div>
                <p className="font-inter font-bold text-sm text-white uppercase tracking-wider">{article.authorName}</p>
                <p className="font-inter text-[10px] text-gray-500 tracking-widest uppercase">Author / Eundeur Editorial</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 relative">
              {copied && <span className="absolute -top-8 right-0 text-brand font-inter text-[10px] font-bold uppercase tracking-widest bg-surface-2 px-2 py-1 rounded">Copied!</span>}
              <button 
                onClick={handleShare}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button onClick={() => alert("Artikel disimpan ke bookmark!")} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand hover:text-black hover:border-brand transition-all">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </header>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-video w-full bg-black mb-16 overflow-hidden"
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            priority
          />
        </motion.div>

        {/* Article Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none font-inter leading-relaxed
            prose-headings:font-outfit prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-brand
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-300 prose-p:mb-6
            prose-a:text-brand prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-brand prose-blockquote:pl-6 prose-blockquote:font-outfit prose-blockquote:text-2xl prose-blockquote:italic prose-blockquote:text-white
            prose-strong:text-white prose-strong:font-bold
            prose-ul:text-gray-300 prose-li:marker:text-brand
            prose-img:grayscale hover:prose-img:grayscale-0 prose-img:transition-all"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* End of Article marker */}
        <div className="flex items-center justify-center gap-4 mt-20 mb-20">
          <div className="h-px bg-white/10 flex-grow"></div>
          <div className="w-3 h-3 bg-brand rotate-45"></div>
          <div className="h-px bg-white/10 flex-grow"></div>
        </div>

        {/* Newsletter Subscription Block */}
        <div className="bg-surface-2 border border-white/10 p-8 md:p-12 mb-20 flex flex-col items-center text-center">
          <h3 className="font-outfit font-black text-3xl text-white uppercase mb-4">
            JOIN <span className="text-brand">THE TRANSMISSION</span>
          </h3>
          <p className="font-inter text-gray-400 max-w-lg mb-8">
            Dapatkan berita eksklusif, pengumuman lineup festival lebih awal, dan penawaran merchandise rahasia langsung ke kotak masuk Anda.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full max-w-md gap-3">
            <input 
              type="email" 
              required
              placeholder="YOUR EMAIL ADDRESS..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-grow bg-background border border-white/20 p-4 font-inter text-sm text-white focus:border-brand outline-none"
            />
            <button type="submit" className="bg-white text-black font-inter font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-brand transition-colors whitespace-nowrap">
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-white/10 pt-16">
            <h3 className="font-inter font-bold text-sm text-white tracking-[0.3em] uppercase mb-8">
              READ NEXT
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Link href={`/news/${item.id}`} key={item.id} className="group flex flex-col">
                  <div className="relative aspect-video w-full bg-black mb-4 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-inter font-bold text-brand text-[10px] tracking-widest uppercase">{item.category}</span>
                    <span className="text-gray-600 text-[10px]">•</span>
                    <span className="font-inter text-gray-500 text-[10px] tracking-widest uppercase">{item.date}</span>
                  </div>
                  <h4 className="font-outfit font-black text-xl text-white uppercase leading-tight group-hover:text-brand transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

      </article>
    </main>
  );
}
