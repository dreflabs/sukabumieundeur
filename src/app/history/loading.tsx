import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Flame } from 'lucide-react';

function SkeletonHistory() {
  return (
    <div className="relative pl-8 md:pl-16">
      <div className="absolute left-0 md:left-4 top-0 w-3 h-3 rounded-full bg-zinc-800 mt-2"></div>
      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-32 h-12" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>
        <Skeleton className="w-2/3 h-7" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-4/5 h-3" />
            <Skeleton className="w-3/5 h-3" />
          </div>
          <Skeleton className="w-full aspect-video rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function HistoryLoading() {
  return (
    <div className="w-full flex flex-col font-sans">
      {/* Cinematic Hero Header (Simplified for Loading) */}
      <section className="relative py-28 px-6 border-b border-zinc-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[20vw] font-black text-zinc-950 tracking-tighter font-outfit leading-none">HISTORY</span>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 backdrop-blur-md text-red-400 text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Memuat Arsip...
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-zinc-800 tracking-tighter font-outfit leading-none">
            HISTORI
          </h1>
        </div>
      </section>

      {/* Timeline Content Skeleton */}
      <main className="py-20 px-6 max-w-5xl mx-auto w-full flex-grow">
        <div className="relative">
          <div className="absolute left-0 md:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-red-600 via-zinc-800 to-transparent"></div>
          <div className="space-y-16">
            {[1, 2, 3].map((i) => <SkeletonHistory key={i} />)}
          </div>
        </div>
      </main>
    </div>
  );
}
