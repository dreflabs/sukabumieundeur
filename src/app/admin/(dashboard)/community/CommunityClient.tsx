'use client';

import React, { useState, useTransition } from 'react';
import { ForumTopic } from '@/types/database';
import { MessageSquare, Trash2, Pin, PinOff, Lock, Unlock, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { toggleTopicPin, toggleTopicLock, deleteTopic } from './actions';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

type TopicWithAuthor = ForumTopic & { author_name: string };

export default function CommunityClient({ initialTopics }: { initialTopics: TopicWithAuthor[] }) {
  const [topics, setTopics] = useState<TopicWithAuthor[]>(initialTopics);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleTogglePin = async (id: string, currentPinStatus: boolean) => {
    setLoadingId(`pin-${id}`);
    startTransition(async () => {
      try {
        const res = await toggleTopicPin(id, currentPinStatus);
        if (res.success) {
          setTopics(topics.map(t => t.id === id ? { ...t, is_pinned: !currentPinStatus } : t).sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned)));
          toast.success(currentPinStatus ? 'Topic unpinned' : 'Topic pinned');
        } else {
          toast.error(res.error || 'Gagal');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      } finally {
        setLoadingId(null);
      }
    });
  };

  const handleToggleLock = async (id: string, currentLockStatus: boolean) => {
    setLoadingId(`lock-${id}`);
    startTransition(async () => {
      try {
        const res = await toggleTopicLock(id, currentLockStatus);
        if (res.success) {
          setTopics(topics.map(t => t.id === id ? { ...t, is_locked: !currentLockStatus } : t));
          toast.success(currentLockStatus ? 'Topic unlocked' : 'Topic locked');
        } else {
          toast.error(res.error || 'Gagal');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      } finally {
        setLoadingId(null);
      }
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus topik "${title}" secara permanen? Semua balasan akan ikut terhapus.`)) return;
    
    setLoadingId(`delete-${id}`);
    startTransition(async () => {
      try {
        const res = await deleteTopic(id);
        if (res.success) {
          setTopics(topics.filter(t => t.id !== id));
          toast.success('Topik dihapus');
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

  if (topics.length === 0) {
    return <EmptyState icon={MessageSquare} title="Belum Ada Topik" description="Forum komunitas masih kosong." />;
  }

  return (
    <div className="bg-card border border-border overflow-hidden shadow-brutal">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-inter text-muted">
          <thead className="bg-background border-b border-border text-muted uppercase tracking-widest text-[10px]">
            <tr>
              <th className="px-4 py-3 font-bold">Topic Title</th>
              <th className="px-4 py-3 font-bold">Author</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{topic.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono">@{topic.author_name}</td>
                <td className="px-4 py-3 text-xs flex gap-2 font-inter tracking-widest uppercase">
                  {topic.is_pinned && <span className="bg-brand/10 text-brand px-2 py-0.5 border border-brand/20">Pinned</span>}
                  {topic.is_locked && <span className="bg-orange-500/10 text-orange-500 px-2 py-0.5 border border-orange-500/20">Locked</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      disabled={isPending || loadingId === `pin-${topic.id}`}
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTogglePin(topic.id, topic.is_pinned)}
                      className={`w-8 h-8 ${topic.is_pinned ? 'text-brand hover:bg-brand/10' : 'text-muted hover:text-white hover:bg-white/10'}`}
                      title={topic.is_pinned ? "Unpin Topic" : "Pin Topic"}
                    >
                      {loadingId === `pin-${topic.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : (topic.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />)}
                    </Button>
                    <Button 
                      disabled={isPending || loadingId === `lock-${topic.id}`}
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleLock(topic.id, topic.is_locked)}
                      className={`w-8 h-8 ${topic.is_locked ? 'text-orange-500 hover:bg-orange-500/10' : 'text-muted hover:text-white hover:bg-white/10'}`}
                      title={topic.is_locked ? "Unlock Topic" : "Lock Topic"}
                    >
                      {loadingId === `lock-${topic.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : (topic.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />)}
                    </Button>
                    <Button 
                      disabled={isPending || loadingId === `delete-${topic.id}`}
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(topic.id, topic.title)}
                      className="w-8 h-8 text-muted hover:text-red-500 hover:bg-red-500/10"
                      title="Delete Topic"
                    >
                      {loadingId === `delete-${topic.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
