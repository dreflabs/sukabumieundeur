'use client';

import React, { useEffect, useState } from 'react';
import { TicketCategory } from '@/types/database';
import { Clock, ShieldCheck, AlertTriangle, X, CreditCard } from 'lucide-react';

interface TicketHoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: {
    reservationId: string;
    category: TicketCategory;
    quantity: number;
    expiresAt: string;
  } | null;
}

export default function TicketHoldModal({
  isOpen,
  onClose,
  reservationData
}: TicketHoldModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  useEffect(() => {
    if (!isOpen || !reservationData) return;

    const expiresTime = new Date(reservationData.expiresAt).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = Math.floor((expiresTime - now) / 1000);
      
      if (difference <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(difference);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, reservationData]);

  if (!isOpen || !reservationData) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft <= 0;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalPrice = reservationData.category.price * reservationData.quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border-2 border-red-600 rounded-lg max-w-lg w-full p-6 shadow-[0_0_40px_rgba(220,38,38,0.3)] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-mono tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4 text-red-500" /> Ticket Lock Active (Anti Race Condition)
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">TIKET BERHASIL DIKUNCI!</h3>
            <p className="text-xs text-zinc-400">
              Kuota tiket Anda aman tersimpan selama timer hitung mundur masih berjalan.
            </p>
          </div>

          {/* Countdown Timer Display */}
          <div className={`p-4 rounded border text-center font-mono ${
            isExpired ? 'bg-red-950/60 border-red-800 text-red-400' : 'bg-zinc-950 border-zinc-800 text-white'
          }`}>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
              {isExpired ? 'WAKTU PEMBAYARAN HABIS' : 'SISA WAKTU UNTUK MENYELESAIKAN PEMBAYARAN'}
            </span>
            <div className="text-4xl font-black tracking-widest flex items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-red-500 animate-pulse" />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Reservation Order Details */}
          <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-3 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>ID Reservasi Lock:</span>
              <span className="font-mono text-white font-bold">{reservationData.reservationId}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Kategori Tiket:</span>
              <span className="font-bold text-white uppercase">{reservationData.category.name}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Jumlah Tiket:</span>
              <span className="font-mono text-white">{reservationData.quantity} Tiket</span>
            </div>
            <div className="flex justify-between text-zinc-400 border-t border-zinc-800 pt-3 text-sm">
              <span className="font-bold text-white">Total Tagihan:</span>
              <span className="font-mono font-black text-red-500">{formatRupiah(totalPrice)}</span>
            </div>
          </div>

          {/* Warning Note */}
          <div className="flex items-start gap-2 bg-amber-950/40 border border-amber-900/60 p-3 rounded text-[11px] text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Jika waktu 15 menit habis sebelum pembayaran dikonfirmasi, kuota tiket otomatis dilepas kembali ke publik.
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={isExpired}
              onClick={() => alert(`Memproses pembayaran Snap Token Midtrans untuk Reservasi ID: ${reservationData.reservationId}`)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Bayar Sekarang ({formatRupiah(totalPrice)})
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Tutup & Selesaikan Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
