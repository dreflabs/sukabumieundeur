'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, ArrowLeft, Flame } from 'lucide-react';

export default function GalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/v1/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setGallery(data.data);
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
          <ImageIcon className="w-4 h-4" /> Media Gallery Portal
        </div>
      </header>

      <section className="py-12 px-6 border-b border-zinc-800 bg-zinc-950/60 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-red-400 text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 text-red-500" /> High-Resolution Photo & Video Archive
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
            GALERI MEDIA <span className="text-red-500">FESTIVAL</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto font-mono">
            Dokumentasi Visual Resolusi Tinggi Rangkaian Acara Sukabumi Eundeur.
          </p>
        </div>
      </section>

      <main className="py-12 px-6 max-w-6xl mx-auto w-full flex-grow">
        {loading ? (
          <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-500">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Memuat galeri media...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {gallery.map((g) => (
              <div key={g.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600/70 transition-all">
                <div className="aspect-square bg-zinc-950 overflow-hidden relative">
                  <img src={g.image_url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-zinc-950/80 border border-zinc-800 px-2.5 py-1 rounded text-[10px] font-mono text-red-400 uppercase tracking-widest">
                    {g.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-xs font-bold text-white uppercase line-clamp-1 group-hover:text-red-500 transition-colors">
                    {g.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
