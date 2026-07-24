"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const artists = [
  { id: 1, name: "KUNTO AJI", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "FEAST", image: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "HINDIA", image: "https://images.unsplash.com/photo-1549834125-82d3c48159a3?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "BILLFOLD", image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=400&auto=format&fit=crop" },
  { id: 5, name: "REALITY CLUB", image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=400&auto=format&fit=crop" }
];

interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
}

interface ArtistsAndNewsProps {
  newsItems: NewsItem[];
}

export default function ArtistsAndNews({ newsItems }: ArtistsAndNewsProps) {
  return (
    <section className="w-full bg-background py-24 border-t border-surface-3">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Featured Artists (Left Column 7/12) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-inter font-bold text-brand text-xs tracking-[0.2em] uppercase mb-2">
                  Featured Artists
                </p>
                <h2 className="font-outfit font-black text-4xl md:text-5xl uppercase text-white">
                  THE SOUNDMAKERS
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {artists.map((artist, i) => (
                <Link href="/artists" key={artist.id} className="block group focus:outline-none focus:ring-2 focus:ring-brand">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col items-center gap-4 w-full"
                  >
                    <div className="relative w-full aspect-[3/4] rounded-none overflow-hidden border border-surface-3 group-hover:border-brand transition-colors">
                      <Image 
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-outfit font-bold text-center text-sm md:text-base text-gray-300 uppercase group-hover:text-brand transition-colors">
                      {artist.name}
                    </h3>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Latest News (Right Column 4/12) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-inter font-bold text-brand text-xs tracking-[0.2em] uppercase mb-2">
                  Latest News
                </p>
                <h2 className="font-outfit font-black text-4xl md:text-5xl uppercase text-white">
                  STAY UPDATED
                </h2>
              </div>
              <Link href="/news" className="mb-2 font-inter font-bold text-brand text-xs tracking-[0.2em] uppercase hover:text-white transition-colors flex items-center gap-2">
                VIEW ALL NEWS 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              {newsItems.map((item, i) => (
                <Link 
                  href={`/news/${item.id}`}
                  key={item.id}
                  className="flex gap-4 group cursor-pointer"
                >
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex gap-4 group cursor-pointer w-full"
                  >
                    <div className="relative w-32 shrink-0 aspect-[3/2] overflow-hidden bg-surface-2 border border-surface-3 group-hover:border-brand transition-colors">
                      <Image 
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-inter font-bold text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-2 leading-snug mb-1">
                        {item.title}
                      </h3>
                      <p className="font-inter font-bold text-xs text-brand tracking-widest uppercase">
                        {item.date}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
