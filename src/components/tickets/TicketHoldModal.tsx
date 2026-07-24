'use client';

import React, { useEffect, useState } from 'react';
import { TicketCategory } from '@/types/database';
import { Clock, ShieldCheck, AlertTriangle, X, CreditCard, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface TicketHoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: {
    reservationId: string;
    category: TicketCategory;
    quantity: number;
    expiresAt: string;
  } | null;
  user?: { id: string; email: string; full_name: string; phone: string } | null;
}

export default function TicketHoldModal({
  isOpen,
  onClose,
  reservationData,
  user
}: TicketHoldModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

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

  const handlePayment = async () => {
    if (!reservationData) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/v1/tickets/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: reservationData.reservationId,
          customerDetails: {
            firstName: user?.full_name?.split(' ')[0] || 'User',
            lastName: user?.full_name?.split(' ').slice(1).join(' ') || '',
            email: user?.email || 'user@sukabumieundeur.com',
            phone: user?.phone || '08000000000'
          }
        })
      });

      const data = await res.json();
      
      if (data.success && data.token) {
        // @ts-ignore
        if (window.snap) {
          // @ts-ignore
          window.snap.pay(data.token, {
            onSuccess: function (result: any) {
              toast.success('Pembayaran Tiket Sukses! Cek email Anda untuk QR Code.');
              onClose();
            },
            onPending: function (result: any) {
              toast('Menunggu pembayaran Anda diselesaikan.', { icon: '⏳' });
            },
            onError: function (result: any) {
              toast.error('Pembayaran gagal, silakan coba lagi.');
            },
            onClose: function () {
              setIsProcessing(false);
            }
          });
        } else {
          toast.error('Sistem pembayaran Midtrans gagal dimuat. Refresh halaman.');
        }
      } else {
        toast.error(data.message || 'Gagal memulai pembayaran.');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Terjadi kesalahan jaringan saat memproses pembayaran.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-surface-1 border-2 border-brand rounded-none max-w-lg w-full p-7 shadow-brutal relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-brand p-1 bg-transparent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand text-black text-xs font-inter font-bold tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4 text-black" /> Ticket Lock Engine Active
            </div>
            <h3 id="modal-title" className="text-2xl font-outfit font-black text-white uppercase tracking-tight">TIKET BERHASIL DIKUNCI!</h3>
            <p className="text-xs text-gray-400 font-inter max-w-xs mx-auto">
              Kuota tiket Anda aman tersimpan selama timer hitung mundur masih berjalan.
            </p>
          </div>

          {/* Countdown Timer Display */}
          <div className={`p-5 border-2 text-center font-outfit ${
            isExpired ? 'bg-red-900/20 border-red-600 text-red-500' : 'bg-transparent border-brand text-brand'
          }`}>
            <span className="text-xs text-gray-400 font-inter font-bold uppercase tracking-widest block mb-1">
              {isExpired ? 'WAKTU PEMBAYARAN HABIS' : 'SISA WAKTU PEMBAYARAN'}
            </span>
            <div className="text-5xl font-black tracking-widest flex items-center justify-center gap-3">
              <Clock className={`w-8 h-8 ${isExpired ? 'text-red-500' : 'text-brand animate-pulse'}`} />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Reservation Order Details */}
          <div className="bg-surface-3 p-5 border border-white/10 space-y-3.5 text-xs font-inter">
            <div className="flex justify-between text-gray-400">
              <span>ID Reservasi Lock:</span>
              <span className="text-white font-bold">{reservationData.reservationId}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Kategori Tiket:</span>
              <span className="font-bold text-white uppercase">{reservationData.category.name}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Jumlah Tiket:</span>
              <span className="text-white">{reservationData.quantity} Tiket</span>
            </div>
            <div className="flex justify-between text-gray-400 border-t border-white/10 pt-3.5 text-sm">
              <span className="font-bold text-white uppercase">Total Tagihan:</span>
              <span className="font-outfit font-black text-brand">{formatRupiah(totalPrice)}</span>
            </div>
          </div>

          {/* Warning Note */}
          <div className="flex items-start gap-2.5 bg-background border border-white/20 p-3.5 text-xs font-inter text-gray-400">
            <AlertTriangle className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <span>
              Jika waktu 15 menit habis sebelum pembayaran dikonfirmasi, kuota tiket otomatis dilepas kembali ke publik.
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isExpired || isProcessing}
              onClick={() => handlePayment()}
              className="w-full py-4 bg-brand hover:bg-white disabled:bg-surface-2 disabled:text-gray-500 text-black font-inter font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 border-brand disabled:border-surface-2 shadow-brutal shadow-brutal-hover"
            >
              <CreditCard className="w-4 h-4" /> 
              {isProcessing ? 'MEMPROSES...' : `BAYAR SEKARANG (${formatRupiah(totalPrice)})`}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-inter text-gray-400 hover:text-white transition-colors uppercase tracking-widest border border-transparent hover:border-white/20"
            >
              Tutup & Selesaikan Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
