"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserX } from "lucide-react";

type Artist = {
  id: string;
  name: string;
  role: string;
  image: string;
};

export default function ArtistsClient({ artists }: { artists: Artist[] }) {
  return (
    <div className="w-full bg-[#050505] min-h-screen flex flex-col">
      {/* Page Hero */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col justify-end pb-16 pt-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=2940&auto=format&fit=crop"
            alt="Artists Background"
            fill
            className="object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-inter font-bold text-brand text-[11px] tracking-[0.2em] uppercase mb-4"
          >
            Lineup Roster
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-none"
          >
            ARTISTS
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 container mx-auto px-6 md:px-12 lg:px-24 py-24">
        
        {/* Controls / Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {['ALL', 'HEADLINER', 'METAL', 'ROCK', 'INDIE'].map((filter, i) => (
              <button 
                key={filter}
                className={`font-inter font-bold text-[10px] tracking-widest uppercase px-4 py-2 transition-colors ${
                  i === 0 ? 'bg-brand text-black' : 'border border-white/20 text-white hover:border-brand hover:text-brand'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="SEARCH ARTIST..." 
              className="w-full bg-[#111] border border-white/10 text-white text-xs px-4 py-3 outline-none focus:border-brand transition-colors uppercase tracking-widest font-inter"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        {/* Grid */}
        {artists.length === 0 ? (
          <EmptyState 
            icon={UserX}
            title="Belum Ada Lineup"
            description="Daftar artis atau pengisi acara belum diumumkan. Kami sedang menyiapkan lineup terbaik untuk Anda."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {artists.map((artist, i) => (
              <motion.div 
                key={artist.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
                className="group flex flex-col cursor-pointer"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#111] mb-6">
                  <Image 
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Decorative border frame on hover */}
                  <div className="absolute inset-4 border border-brand opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-500 pointer-events-none" />
                </div>
                
                <div className="flex flex-col items-center text-center px-4">
                  <p className="font-inter font-bold text-brand text-[10px] tracking-[0.2em] uppercase mb-2">
                    {artist.role}
                  </p>
                  <h3 className="font-outfit font-black text-2xl text-white uppercase group-hover:text-brand transition-colors">
                    {artist.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </section>
    </div>
  );
}
