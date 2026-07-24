'use client';

import React, { useState, useTransition } from 'react';
import { GalleryItem } from '@/types/database';
import { Image as ImageIcon, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { addGalleryItem, deleteGalleryItem } from './actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function GalleryClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await addGalleryItem(formData);
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
    if (!confirm(`Hapus foto "${title}"?`)) return;
    
    startTransition(async () => {
      try {
        const res = await deleteGalleryItem(id);
        if (res.success) {
          setItems(items.filter(item => item.id !== id));
          toast.success('Foto dihapus');
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
          {isAdding ? 'Batal' : 'Tambah Foto'}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-lg space-y-4 shadow-brutal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gallery-title" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Judul / Caption</label>
              <Input id="gallery-title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" />
            </div>
            <div>
              <label htmlFor="gallery-category" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Kategori (Event)</label>
              <Input id="gallery-category" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} type="text" placeholder="Misal: SE 2023" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="gallery-url" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">URL Gambar</label>
              <Input id="gallery-url" required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} type="url" placeholder="https://..." />
            </div>
          </div>
          <Button disabled={isPending} type="submit" className="w-full justify-center">
            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> MENYIMPAN...</> : 'Simpan Foto'}
          </Button>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyState icon={ImageIcon} title="Galeri Kosong" description="Tambahkan foto pertama Anda." />
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="relative group break-inside-avoid">
              <img src={item.image_url} alt={item.title} className="w-full rounded-lg object-cover" />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <Button 
                    disabled={isPending}
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item.id, item.title)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                  <span className="text-xs text-brand font-mono px-2 py-0.5 bg-black border border-brand/30 rounded">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
