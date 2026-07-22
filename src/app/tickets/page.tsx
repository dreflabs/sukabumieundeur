'use client';

import React, { useEffect, useState } from 'react';
import { TicketCategory, Event } from '@/types/database';
import TicketCategoryCard from '@/components/tickets/TicketCategoryCard';
import TicketHoldModal from '@/components/tickets/TicketHoldModal';
import { Flame, Ticket, ShieldCheck, RefreshCw, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TicketsPage() {
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [activeReservation, setActiveReservation] = useState<{
    reservationId: string;
    category: TicketCategory;
    quantity: number;
    expiresAt: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchTicketData = async () => {
    setLoading(true);
    try {
      // Fetch Event details
      const eventRes = await fetch('/api/v1/events');
      const eventData = await eventRes.json();
      if (eventData.success && eventData.data.length > 0) {
        setEvent(eventData.data[0]);
      }

      // Fetch Ticket Categories
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

  useEffect(() => {
    fetchTicketData();
  }, []);

  const handleHoldTicket = async (category: TicketCategory, quantity: number) => {
    setIsHolding(true);
    try {
      const res = await fetch('/api/v1/tickets/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketCategoryId: category.id,
          quantity: quantity,
          userId: 'user-sample-uuid-12345'
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
        // Refresh ticket quotas
        fetchTicketData();
      } else {
        alert(result.error || 'Gagal mengunci tiket.');
      }
    } catch (err) {
      console.error('Error holding ticket:', err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsHolding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Home
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-red-500">
          <ShieldCheck className="w-4 h-4" /> Ticket War Lock Manager Active
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-12 px-6 border-b border-zinc-800 bg-zinc-950/60">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-red-400 text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Official Ticket War Portal 2026
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
            TIKET FESTIVAL <span className="text-red-500">SUKABUMI EUNDEUR</span>
          </h1>

          {event && (
            <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500" /> 15 AGUSTUS 2026
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" /> {event.venue}, {event.city}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Ticket Grid */}
      <main className="py-16 px-6 max-w-6xl mx-auto w-full flex-grow">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
            <Ticket className="w-5 h-5 text-red-500" /> Kategori Tiket Tersedia
          </h2>
          <button
            onClick={fetchTicketData}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Kuota
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-500">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Memuat kuota tiket real-time...</p>
          </div>
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
      </main>

      {/* Modal Countdown Timer */}
      <TicketHoldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reservationData={activeReservation}
      />
    </div>
  );
}
