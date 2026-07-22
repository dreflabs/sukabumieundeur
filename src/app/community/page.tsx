'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, MessageSquare, Pin, PlusCircle, Flame } from 'lucide-react';

export default function CommunityPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/v1/community/topics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTopics(data.data);
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
          <Users className="w-4 h-4" /> Community & Forum Hub
        </div>
      </header>

      <section className="py-12 px-6 border-b border-zinc-800 bg-zinc-950/60">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-red-400 text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Forum Diskusi Komunitas
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
            FORUM DISKUSI <span className="text-red-500">SUKABUMI UNDERGROUND</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xl">
            Ruang Interaksi Komunitas Musik Heavy Metal, Band Reviews, & Sharing Info Skena Lokal.
          </p>
        </div>
      </section>

      <main className="py-12 px-6 max-w-6xl mx-auto w-full flex-grow space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase text-white tracking-wide">Topik Diskusi Terkini</h2>
          <button
            onClick={() => alert('Fitur buat topik baru tersedia untuk member terdaftar.')}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Buat Topik Baru
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-500">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Memuat forum diskusi...</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
            {topics.map((t) => (
              <div key={t.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors">
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center gap-2">
                    {t.is_pinned && (
                      <span className="bg-red-950 border border-red-800 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                        <Pin className="w-3 h-3 text-red-500" /> Pinned
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                      {t.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white uppercase hover:text-red-500 transition-colors cursor-pointer">
                    {t.title}
                  </h3>
                  <div className="text-[11px] font-mono text-zinc-500">
                    Oleh <span className="text-zinc-300">@{t.author_name}</span> · {new Date(t.created_at).toLocaleDateString('id-ID')}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950 px-3.5 py-1.5 rounded border border-zinc-800 shrink-0">
                  <MessageSquare className="w-4 h-4 text-red-500" />
                  <span>{t.posts_count || 12} Balasan</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
