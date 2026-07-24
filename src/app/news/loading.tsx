import React from 'react';
import { Newspaper, Flame } from 'lucide-react';
import { SkeletonNews } from '@/components/ui/Skeleton';

export default function NewsLoading() {
  return (
    <div className="w-full flex flex-col font-sans">
      {/* Cinematic Hero Header (Simplified for Loading) */}
      <section className="relative py-28 px-6 border-b border-zinc-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[20vw] font-black text-zinc-950 tracking-tighter font-outfit leading-none">BERITA</span>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 backdrop-blur-md text-red-400 text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Memuat Informasi...
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-zinc-800 tracking-tighter font-outfit leading-none">
            BERITA
          </h1>
        </div>
      </section>

      {/* Grid Content Skeleton */}
      <main className="py-20 px-6 max-w-6xl mx-auto w-full flex-grow">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonNews key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
