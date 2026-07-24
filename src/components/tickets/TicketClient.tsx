'use client';

import React, { useState } from 'react';
import { TicketCategory, Event } from '@/types/database';
import TicketCategoryCard from '@/components/tickets/TicketCategoryCard';
import TicketHoldModal from '@/components/tickets/TicketHoldModal';
import { Ticket, RefreshCw, TicketX } from 'lucide-react';
import { SkeletonTicket } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

interface TicketClientProps {
  initialCategories: TicketCategory[];
}

export default function TicketClient({ initialCategories }: TicketClientProps) {
  const [categories, setCategories] = useState<TicketCategory[]>(initialCategories);
  const [loading, setLoading] = useState<boolean>(false);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [activeReservation, setActiveReservation] = useState<{
    reservationId: string;
    category: TicketCategory;
    quantity: number;
    expiresAt: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; email: string; full_name: string; phone: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUser(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const fetchTicketData = async () => {
    setLoading(true);
    try {
      const categoriesRes = await fetch('/api/v1/tickets/categories');
      const categoriesData = await categoriesRes.json();
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHoldTicket = async (category: TicketCategory, quantity: number) => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu untuk memesan tiket.');
      window.location.href = '/login?callbackUrl=/tickets';
      return;
    }
    
    setIsHolding(true);
    try {
      const res = await fetch('/api/v1/tickets/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCategoryId: category.id,
          quantity: quantity,
          userId: user.id
        })
      });

      const result = await res.json();
      if (result.success) {
        setActiveReservation({
          reservationId: result.data.reservationId,
          category: category,
          quantity: quantity,
          expiresAt: result.data.expiresAt
        });
        setIsModalOpen(true);
        fetchTicketData(); // Refresh ticket quotas
      } else {
        toast.error(result.error || 'Gagal mengunci tiket.');
      }
    } catch (err) {
      console.error('Error holding ticket:', err);
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setIsHolding(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-outfit font-black uppercase text-white tracking-widest flex items-center gap-2">
          <Ticket className="w-5 h-5 text-brand" /> Kategori Tiket Tersedia
        </h2>
        <button
          onClick={() => fetchTicketData()}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-inter font-bold text-gray-400 hover:text-brand px-3 py-1.5 rounded-none border border-white/20 bg-transparent transition-colors uppercase tracking-widest"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Kuota
        </button>
      </div>
      
      {activeReservation && !isModalOpen && (
        <div className="bg-brand/10 border border-brand/50 p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold font-inter text-sm mb-1">Anda memiliki reservasi aktif!</h3>
            <p className="text-gray-400 text-xs">Selesaikan pembayaran untuk {activeReservation.quantity} tiket {activeReservation.category.name} sebelum kadaluarsa.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-brand text-black font-inter font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap"
          >
            Lanjutkan Pembayaran
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonTicket key={i} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState 
          icon={TicketX}
          title="Tiket Belum Tersedia"
          description="Penjualan tiket untuk festival belum dibuka atau tiket sudah habis terjual. Pantau terus info terbaru dari Sukabumi Eundeur."
        />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <TicketCategoryCard
              key={cat.id}
              category={cat}
              onHoldTicket={handleHoldTicket}
              isHolding={isHolding}
            />
          ))}
        </div>
      )}

      {activeReservation && (
        <TicketHoldModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reservationData={activeReservation}
          user={user}
        />
      )}
    </>
  );
}
