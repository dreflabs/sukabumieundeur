'use client';

import React, { useState, useTransition } from 'react';
import { HistoryEvent } from '@/types/database';
import { History, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { addHistoryEvent, deleteHistoryEvent } from './actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function HistoryClient({ initialEvents }: { initialEvents: HistoryEvent[] }) {
  const [events, setEvents] = useState<HistoryEvent[]>(initialEvents);
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    year: '',
    title: '',
    date: '',
    venue: '',
    attendees: '',
    headliners: '',
    cover: '',
    aftermovie_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await addHistoryEvent(formData);
        if (res.success) {
          setIsAdding(false);
          toast.success('Berhasil ditambahkan!');
          window.location.reload();
        } else {
          toast.error(res.error || 'Gagal');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      }
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus riwayat event "${title}"?`)) return;
    
    startTransition(async () => {
      try {
        const res = await deleteHistoryEvent(id);
        if (res.success) {
          setEvents(events.filter(e => e.id !== id));
          toast.success('Riwayat dihapus');
        } else {
          toast.error(res.error || 'Gagal menghapus');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"} className="flex items-center gap-2">
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Batal' : 'Tambah Event'}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-lg space-y-4 shadow-brutal">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="history-year" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Tahun (Year)</label>
              <Input id="history-year" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} type="text" />
            </div>
            <div>
              <label htmlFor="history-title" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Judul Event</label>
              <Input id="history-title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" />
            </div>
            <div>
              <label htmlFor="history-date" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Tanggal & Bulan</label>
              <Input id="history-date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} type="text" placeholder="Misal: 15 Agustus" />
            </div>
            <div>
              <label htmlFor="history-venue" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Lokasi (Venue)</label>
              <Input id="history-venue" required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} type="text" />
            </div>
            <div>
              <label htmlFor="history-attendees" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Jumlah Peserta</label>
              <Input id="history-attendees" required value={formData.attendees} onChange={e => setFormData({...formData, attendees: e.target.value})} type="text" placeholder="Misal: 10,000+" />
            </div>
            <div>
              <label htmlFor="history-cover" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">URL Cover Image</label>
              <Input id="history-cover" required value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} type="text" />
            </div>
            <div className="col-span-2">
              <label htmlFor="history-headliners" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Headliners (Pisahkan koma)</label>
              <Input id="history-headliners" required value={formData.headliners} onChange={e => setFormData({...formData, headliners: e.target.value})} type="text" />
            </div>
            <div className="col-span-2">
              <label htmlFor="history-aftermovie" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">URL Aftermovie (Opsional)</label>
              <Input id="history-aftermovie" value={formData.aftermovie_url} onChange={e => setFormData({...formData, aftermovie_url: e.target.value})} type="text" />
            </div>
          </div>
          <Button disabled={isPending} type="submit" className="w-full justify-center">
            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> MENYIMPAN...</> : 'Simpan Riwayat'}
          </Button>
        </form>
      )}

      {events.length === 0 ? (
        <EmptyState icon={History} title="Belum Ada Riwayat" description="Tambahkan data riwayat event masa lalu." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="bg-card border border-border rounded-lg overflow-hidden group">
              <div className="relative h-48 bg-black">
                {ev.cover && (
                  <img src={ev.cover} alt={ev.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="absolute top-2 right-2">
                  <Button 
                    disabled={isPending}
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(ev.id, ev.title)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 border border-border text-xs font-inter tracking-widest font-bold uppercase text-white">
                  {ev.year}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{ev.title}</h3>
                <p className="text-xs text-muted font-inter tracking-widest uppercase mb-2">{ev.date} | {ev.venue}</p>
                <div className="text-xs text-gray-400 line-clamp-2">
                  Headliners: {ev.headliners.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
