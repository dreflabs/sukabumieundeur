export const dynamic = 'force-dynamic';
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';

export default function TicketScannerPage() {
  const [ticketCode, setTicketCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/v1/tickets/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticketCode })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
        setTicketCode('');
      } else {
        setError(data.error || 'Terjadi kesalahan saat memvalidasi tiket.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="font-outfit font-black text-3xl uppercase tracking-tight text-white mb-6">Scanner Tiket Hari-H</h1>
      
      <div className="bg-card border border-border p-6 shadow-brutal mb-8">
        <form onSubmit={handleScan} className="flex flex-col space-y-4">
          <label htmlFor="ticketCode" className="text-xs font-inter tracking-widest uppercase text-muted">
            Masukkan Kode Tiket (Manual Input / Barcode Scanner)
          </label>
          <div className="flex gap-4">
            <Input
              id="ticketCode"
              type="text"
              className="flex-1"
              placeholder="Contoh: TCK-XXXXXX"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              required
              autoFocus
            />
            <Button
              type="submit"
              disabled={loading || !ticketCode}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {loading ? 'MEMVALIDASI...' : 'CHECK-IN'}
            </Button>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-emerald-950/30 border border-emerald-500/50 p-6 shadow-brutal">
          <div className="flex items-center gap-3 text-emerald-400 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-outfit font-black uppercase tracking-tight">Tiket Valid & Check-In Sukses!</h2>
          </div>
          <div className="space-y-2 text-zinc-300 font-inter text-sm">
            <p><span className="font-bold text-white uppercase tracking-widest text-[10px] mr-2">Nama:</span> {result.attendeeName}</p>
            <p><span className="font-bold text-white uppercase tracking-widest text-[10px] mr-2">Kategori:</span> {result.category}</p>
            <p><span className="font-bold text-white uppercase tracking-widest text-[10px] mr-2">Kode:</span> {result.ticketCode}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-950/30 border border-red-500/50 p-6 shadow-brutal">
          <div className="flex items-center gap-3 text-red-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 className="text-xl font-outfit font-black uppercase tracking-tight">Check-In Gagal</h2>
              <p className="text-sm font-inter text-muted mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
