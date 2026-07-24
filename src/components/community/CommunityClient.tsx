'use client';

import React from 'react';
import { MessageSquare, Pin, PlusCircle, MessageCircleX } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

interface CommunityClientProps {
  topics: any[];
}

export default function CommunityClient({ topics }: CommunityClientProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <h2 className="text-2xl font-black uppercase text-white tracking-tight font-outfit">Topik Diskusi <span className="text-brand">Terkini</span></h2>
        <button
          onClick={() => toast.error('Fitur buat topik baru tersedia untuk member terdaftar.')}
          className="bg-brand hover:bg-white text-black text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-none flex items-center gap-2 transition-all shadow-brutal hover:shadow-brutal-hover"
        >
          <PlusCircle className="w-4 h-4" /> Buat Topik Baru
        </button>
      </div>

      {topics.length === 0 ? (
        <EmptyState 
          icon={MessageCircleX}
          title="Forum Masih Kosong"
          description="Belum ada topik diskusi yang dibuat oleh komunitas. Jadilah yang pertama untuk memulai percakapan di skena ini!"
          actionLabel="Mulai Diskusi Baru"
          actionHref="#"
        />
      ) : (
        <div className="bg-surface-1 backdrop-blur-xl border border-white/10 rounded-none shadow-brutal-lg overflow-hidden divide-y divide-white/10">
          {topics.map((t) => (
            <div key={t.id} className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-surface-2 transition-colors group cursor-pointer">
              <div className="flex items-start gap-4 flex-grow w-full">
                <div className="w-12 h-12 rounded-none bg-surface-2 border border-white/10 flex items-center justify-center font-bold text-lg text-gray-500 shrink-0 group-hover:border-brand/50 group-hover:text-brand transition-colors shadow-brutal">
                  {t.author_name ? t.author_name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    {t.is_pinned && (
                      <span className="bg-brand/10 border border-brand/30 text-brand text-xs font-mono font-bold px-2 py-0.5 rounded-none flex items-center gap-1 uppercase tracking-widest">
                        <Pin className="w-3 h-3 text-brand" /> Pinned
                      </span>
                    )}
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest px-2 py-0.5 rounded-none bg-surface-2 border border-white/10">
                      {t.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">
                    {t.title}
                  </h3>
                  <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                    <span className="text-gray-300 font-bold">@{t.author_name}</span> 
                    <span>•</span>
                    <span>{new Date(t.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 bg-surface-2 px-4 py-2.5 rounded-none border border-white/10 shrink-0 group-hover:border-brand/30 transition-colors">
                <MessageSquare className="w-4 h-4 text-brand" />
                <span>{t.posts_count || 12} BALASAN</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
