'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function EventFormClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    city: 'Sukabumi',
    start_date: '',
    end_date: '',
    banner_url: '',
    is_active: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || 'Gagal menyimpan event');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <button type="button" onClick={() => router.back()} className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-mono mb-2 transition-colors">
            <ArrowLeft className="w-3 h-3" /> KEMBALI
          </button>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">BUAT EVENT BARU</h1>
          <p className="text-xs text-zinc-400 font-mono">Publikasikan festival atau acara baru ke dalam sistem.</p>
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm rounded transition-colors"
        >
          {loading ? 'MENYIMPAN...' : (
            <>
              <Save className="w-4 h-4" /> SIMPAN EVENT
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-900 rounded p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-red-200 text-sm">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Informasi Utama</h2>
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Judul Event / Festival</label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Misal: Sukabumi Eundeur 2026"
                className="w-full bg-black border border-zinc-800 text-white px-4 py-2.5 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Deskripsi Lengkap</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Deskripsikan lineup, tema, atau informasi penting lainnya..."
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Meta & Location */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Jadwal & Lokasi</h2>
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Waktu Mulai (Start)</label>
              <input 
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Waktu Selesai (End)</label>
              <input 
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Nama Tempat (Venue)</label>
              <input 
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                placeholder="Misal: Lapang Merdeka"
                className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Kota</label>
              <input 
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full bg-black border border-zinc-800 text-white px-4 py-2 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm"
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Status Publikasi</h2>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-zinc-800 rounded hover:bg-zinc-800/50 transition-colors">
              <input 
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 accent-red-600 bg-black border-zinc-700"
              />
              <span className="text-sm font-bold text-white">Publikasikan Event</span>
            </label>
            <p className="text-xs text-zinc-500 font-mono mt-2">
              Jika tidak dicentang, event akan disimpan sebagai Draft dan tidak terlihat oleh publik.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
