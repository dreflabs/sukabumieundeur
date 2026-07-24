import React from 'react';
import { Flame } from 'lucide-react';
import GalleryClient from '@/components/ui/GalleryClient';

async function getGallery() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1/gallery`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.success ? data.data : [];
}

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Hero Header */}
      <section className="relative py-24 px-6 border-b border-zinc-800/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-6 fade-in-up text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 backdrop-blur-md text-red-400 text-xs font-mono tracking-widest uppercase shadow-lg">
            <Flame className="w-3.5 h-3.5 text-red-500" /> High-Resolution Photo &amp; Video Archive
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter font-outfit leading-none drop-shadow-xl">
            GALERI <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">MEDIA</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto font-mono leading-relaxed">
            Dokumentasi Visual Resolusi Tinggi Rangkaian Acara Sukabumi Eundeur — dari Moshpit hingga Backstage.
          </p>
        </div>
      </section>

      {/* Client Component for Interactive Filter & Layout */}
      <GalleryClient initialData={gallery} />
    </div>
  );
}
