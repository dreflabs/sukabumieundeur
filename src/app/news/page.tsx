'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, ArrowLeft, Calendar, Flame, Clock } from 'lucide-react';

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/v1/news')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setArticles(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Home
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-red-500">
          <Newspaper className="w-4 h-4" /> Heavy Music News Portal
        </div>
      </header>

      <section className="py-12 px-6 border-b border-zinc-800 bg-zinc-950/60">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-red-400 text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Official Editorial Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
            BERITA & <span className="text-red-500">SKENA UNDERGROUND</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xl">
            Kabar Terkini Seputar Festival, Album Kompilasi, Band Review, & Komunitas Musik Sukabumi.
          </p>
        </div>
      </section>

      <main className="py-12 px-6 max-w-6xl mx-auto w-full flex-grow">
        {loading ? (
          <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-500">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Memuat warta berita skena...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((item) => (
              <article key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600/70 transition-all flex flex-col">
                <div className="aspect-video bg-zinc-950 overflow-hidden relative">
                  <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-zinc-950/80 border border-zinc-800 px-2.5 py-1 rounded text-[10px] font-mono text-red-400 uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
                <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-white uppercase group-hover:text-red-500 transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{item.excerpt}</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-red-500" /> {new Date(item.published_at).toLocaleDateString('id-ID')}</span>
                    <span className="text-red-400 uppercase tracking-wider font-bold">Baca Selengkapnya →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
