'use client';

import React, { useState } from 'react';
import { Images } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function GalleryClient({ initialData }: { initialData: any[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(initialData.map((g) => g.category)))];
  const filtered = activeFilter === 'ALL' ? initialData : initialData.filter((g) => g.category === activeFilter);

  return (
    <>
      {/* Sticky Filter Bar */}
      <div className="sticky top-[64px] z-30 border-b border-zinc-800/80 bg-black/90 backdrop-blur-xl px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                activeFilter === cat
                  ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Masonry Grid */}
      <main className="py-12 px-6 max-w-6xl mx-auto w-full flex-grow">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Images}
            title="Galeri Masih Kosong"
            description="Belum ada foto atau video dari festival yang diunggah. Dokumentasi visual akan segera hadir setelah festival berlangsung."
          />
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((g, index) => (
              <div
                key={g.id}
                className={`break-inside-avoid bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-red-600/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)] fade-in-up stagger-${(index % 4) + 1}`}
              >
                <div className="relative overflow-hidden bg-zinc-950">
                  <img
                    src={g.image_url}
                    alt={g.title}
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur border border-zinc-700 px-2 py-0.5 rounded text-[9px] font-mono text-red-400 uppercase tracking-widest">
                    {g.category}
                  </span>
                </div>
                <div className="p-3 border-t border-zinc-800/80">
                  <h3 className="text-[10px] font-bold text-white uppercase line-clamp-1 group-hover:text-red-500 transition-colors tracking-widest">
                    {g.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
