'use client';

import React, { useState, useTransition } from 'react';
import { ContactMessage } from '@/types/database';
import { Mail, MailOpen, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { markMessageRead, deleteMessage } from './actions';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function MessagesClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMarkRead = async (id: string) => {
    setLoadingId(id);
    startTransition(async () => {
      try {
        const res = await markMessageRead(id);
        if (res.success) {
          setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
          toast.success("Pesan ditandai telah dibaca");
        } else {
          toast.error(res.error || 'Gagal mengubah status');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      } finally {
        setLoadingId(null);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini secara permanen?')) return;
    setLoadingId(id);
    
    startTransition(async () => {
      try {
        const res = await deleteMessage(id);
        if (res.success) {
          setMessages(messages.filter(m => m.id !== id));
          toast.success("Pesan dihapus");
        } else {
          toast.error(res.error || 'Gagal menghapus');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      } finally {
        setLoadingId(null);
      }
    });
  };

  if (messages.length === 0) {
    return <EmptyState icon={MailOpen} title="Inbox Kosong" description="Belum ada pesan kontak yang masuk." />;
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`p-4 border transition-colors shadow-brutal ${msg.is_read ? 'bg-card border-border' : 'bg-red-950/20 border-red-900/50'}`}>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-sm font-bold ${msg.is_read ? 'text-zinc-300' : 'text-white'}`}>{msg.subject}</h3>
                  <p className="text-xs font-inter tracking-widest uppercase text-muted mt-1">Dari: {msg.name} ({msg.email})</p>
                </div>
                <span className="text-[10px] text-muted font-inter tracking-widest uppercase whitespace-nowrap">
                  {new Date(msg.created_at).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-background p-3 border border-border text-sm text-zinc-300 whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
            
            <div className="flex md:flex-col justify-end gap-2 shrink-0">
              {!msg.is_read && (
                <Button 
                  disabled={isPending || loadingId === msg.id}
                  onClick={() => handleMarkRead(msg.id)}
                  variant="outline"
                  size="sm"
                  className="text-brand border-brand hover:bg-brand/10"
                >
                  {loadingId === msg.id ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 mr-2" />} Tandai Dibaca
                </Button>
              )}
              <Button 
                disabled={isPending || loadingId === msg.id}
                onClick={() => handleDelete(msg.id)}
                variant="ghost"
                size="sm"
                className="text-muted hover:text-red-500 hover:bg-red-500/10"
              >
                {loadingId === msg.id ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />} Hapus
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
