'use client';

import React, { useState } from 'react';
import { Ticket, ShoppingBag, User, LogOut, QrCode, Calendar, MapPin, ShieldCheck, ArrowRight, Clock, Star, Mail } from 'lucide-react';
import { Profile } from '@/types/database';
import Image from 'next/image';

interface DashboardClientProps {
  profile: Profile | null;
}

export default function DashboardClient({ profile }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'tickets' | 'orders' | 'profile'>('tickets');

  return (
    <>
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 text-center shadow-xl fade-in-up relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
          
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-red-500 font-black text-3xl shadow-inner relative z-10">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full z-0"></div>
          </div>
          
          <div>
            <h3 className="font-black text-white text-lg uppercase tracking-tight font-outfit">{profile?.full_name}</h3>
            <p className="text-[11px] text-zinc-500 font-mono mb-4">@{profile?.username}</p>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Star className="w-3 h-3 fill-red-500" /> {profile?.role} ACCESS
          </div>
        </div>

        <nav className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-3 space-y-2 text-xs font-mono fade-in-up stagger-1 shadow-xl">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'tickets' ? 'bg-red-600/10 text-red-500 font-bold border border-red-500/30' : 'text-zinc-400 hover:bg-zinc-800/50 border border-transparent'
            }`}
          >
            <Ticket className="w-4 h-4" /> Tiket Saya (E-Ticket)
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-red-600/10 text-red-500 font-bold border border-red-500/30' : 'text-zinc-400 hover:bg-zinc-800/50 border border-transparent'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Pesanan Apparels
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'profile' ? 'bg-red-600/10 text-red-500 font-bold border border-red-500/30' : 'text-zinc-400 hover:bg-zinc-800/50 border border-transparent'
            }`}
          >
            <User className="w-4 h-4" /> Profil & Pengaturan
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="lg:col-span-3 space-y-6">
        
        {activeTab === 'tickets' && (
          <div className="space-y-6 fade-in-up">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-outfit">E-TICKET FESTIVAL</h2>
            <div className="bg-gradient-to-r from-red-950/40 to-black border border-red-900/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_30px_rgba(220,38,38,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
              
              <div className="bg-white p-4 rounded-xl shrink-0 relative z-10 shadow-2xl">
                <div className="w-32 h-32 md:w-40 md:h-40 relative">
                  <Image src="/images/qr-code-placeholder.png" alt="QR Code Ticket" fill className="object-contain" />
                </div>
              </div>
              
              <div className="space-y-4 w-full relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 text-white text-[10px] font-mono font-bold tracking-widest uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" /> Valid & Confirmed
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">VIP EARLY BIRD</h3>
                  <p className="text-zinc-400 font-mono text-sm mt-1">Order #TKT-88992-XXY</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-red-900/30">
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Jadwal</span>
                    <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-1"><Calendar className="w-3.5 h-3.5 text-red-500" /> 15 Agt 2026</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Lokasi</span>
                    <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5 text-red-500" /> Lap. Merdeka, SMI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 fade-in-up">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-outfit">PESANAN MERCHANDISE</h2>
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-2 text-zinc-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase">Belum Ada Pesanan</h3>
              <p className="text-xs text-zinc-500 font-mono max-w-sm mx-auto leading-relaxed">
                Anda belum melakukan pembelian merchandise apa pun. Kunjungi toko resmi kami untuk mendapatkan apparel edisi terbatas.
              </p>
              <button className="mt-4 bg-zinc-800 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors shadow-lg">
                Ke Halaman Toko
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 fade-in-up">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-outfit">PROFIL & PENGATURAN</h2>
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Nama Lengkap</label>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 font-mono">
                    {profile?.full_name}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Email Address</label>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 font-mono flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-500" /> {profile?.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Username</label>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 font-mono">
                    @{profile?.username}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">No. Handphone</label>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-300 font-mono">
                    {profile?.phone}
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-800/80 flex justify-end">
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors">
                  Edit Profil
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}
