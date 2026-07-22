'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, ArrowLeft, Calendar, MapPin, Users, Video } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/v1/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setHistory(data.data);
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
          <History className="w-4 h-4" /> History & Event Archive
        </div>
      </header>

      <section className="py-12 px-6 border-b border-zinc-800 bg-zinc-950/60 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
            HISTORI <span className="text-red-500">SUKABUMI EUNDEUR</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto font-mono">
            Arsip Perjalanan Penyelenggaraan Festival Musik Heavy Metal Sukabumi Dari Masa Ke Masa.
          </p>
        </div>
      </section>

      <main className="py-16 px-6 max-w-5xl mx-auto w-full flex-grow space-y-12">
        {loading ? (
          <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-500">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Memuat arsip histori festival...</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.year} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <span className="text-3xl font-black text-red-500 font-mono">{item.year}</span>
                <span className="text-xs font-mono bg-zinc-950 px-3 py-1 rounded border border-zinc-800 text-zinc-400">
                  {item.attendees}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white uppercase">{item.title}</h3>
                  <div className="text-xs font-mono text-zinc-400 space-y-1.5">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-500" /> {item.date}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> {item.venue}</div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Headliners Performers:</span>
                    <div className="flex flex-wrap gap-2">
                      {item.headliners.map((h: string) => (
                        <span key={h} className="text-xs font-mono bg-red-950/80 border border-red-800 text-red-400 px-3 py-1 rounded font-bold uppercase">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 relative group">
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center gap-2 text-xs font-bold font-mono">
                      <Video className="w-5 h-5" /> Tonton Aftermovie {item.year}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
