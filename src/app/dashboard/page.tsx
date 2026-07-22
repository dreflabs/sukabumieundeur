'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Ticket, ShoppingBag, User, LogOut, QrCode, Calendar, MapPin, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { Profile } from '@/types/database';

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<'tickets' | 'orders' | 'profile'>('tickets');

  useEffect(() => {
    // Mock user profile
    setProfile({
      id: 'usr-demo-12345',
      email: 'metalhead@sukabumieundeur.com',
      username: 'metalhead_skbm',
      full_name: 'Sukabumi Underground Member',
      phone: '081234567890',
      role: 'MEMBER',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 bg-red-600 rounded-md flex items-center justify-center font-black text-xl text-black shadow-[0_0_15px_rgba(220,38,38,0.6)]">
            SE
          </Link>
          <div>
            <span className="font-extrabold text-sm tracking-widest text-white block uppercase">MEMBER PORTAL</span>
            <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase block -mt-1">Sukabumi Eundeur Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white font-mono uppercase tracking-wider">
            Public Web
          </Link>
          <Link href="/login" className="bg-zinc-900 border border-zinc-800 hover:border-red-600 text-xs font-mono px-3 py-1.5 rounded flex items-center gap-1.5 text-zinc-300">
            <LogOut className="w-3.5 h-3.5 text-red-500" /> Logout
          </Link>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="max-w-6xl mx-auto w-full py-10 px-6 grid md:grid-cols-4 gap-8 flex-grow">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-3 text-center">
            <div className="w-16 h-16 bg-zinc-950 border border-red-600/60 rounded-full mx-auto flex items-center justify-center text-red-500 font-black text-2xl">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase">{profile?.full_name}</h3>
              <p className="text-xs text-zinc-500 font-mono">@{profile?.username}</p>
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-400 text-[10px] font-mono font-bold tracking-widest uppercase">
              Role: {profile?.role}
            </div>
          </div>

          <nav className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 space-y-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors ${
                activeTab === 'tickets' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <Ticket className="w-4 h-4" /> Tiket Saya (E-Ticket)
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors ${
                activeTab === 'orders' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Pesanan Saya
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors ${
                activeTab === 'profile' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <User className="w-4 h-4" /> Pengaturan Profil
            </button>
          </nav>
        </aside>

        {/* Main Content View */}
        <main className="md:col-span-3 space-y-6">
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">E-TIKET SAYA</h2>
                  <p className="text-xs text-zinc-400">Tunjukkan kode QR digital di lokasi gate festival untuk Check-in.</p>
                </div>
                <Link href="/tickets" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2">
                  <Ticket className="w-3.5 h-3.5" /> Beli Tiket Lagi
                </Link>
              </div>

              {/* Ticket Card Sample */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-3 flex-grow">
                  <span className="text-[10px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-400 px-2.5 py-1 rounded font-bold uppercase">
                    ISSUED & VALID FOR ENTRY
                  </span>
                  <h3 className="text-2xl font-black text-white uppercase">MOSHPIT VIP PASS</h3>
                  <div className="text-xs text-zinc-400 space-y-1 font-mono">
                    <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-red-500" /> 15 AGUSTUS 2026 (Open Gate 12:00 WIB)</div>
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-red-500" /> Stadion Surajaya Sukabumi</div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">Kode Tiket: TKT-2026-VIP-8899201</div>
                </div>

                <div className="bg-zinc-950 p-4 rounded border border-zinc-800 text-center shrink-0">
                  <div className="w-28 h-28 bg-white p-2 rounded flex items-center justify-center mx-auto mb-2">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 block">QR CHECK-IN DIGI</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-4">RIWAYAT PESANAN</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center text-xs text-zinc-500 font-mono py-12">
                Belum ada transaksi merchandise fisik. Katalog merchandise tersedia di publik web.
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-4">PROFIL PENGGUNA</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div><span className="text-zinc-500 block mb-1">NAMA LENGKAP</span><span className="text-white font-bold">{profile?.full_name}</span></div>
                  <div><span className="text-zinc-500 block mb-1">USERNAME</span><span className="text-white font-bold">@{profile?.username}</span></div>
                  <div><span className="text-zinc-500 block mb-1">EMAIL</span><span className="text-white font-bold">{profile?.email}</span></div>
                  <div><span className="text-zinc-500 block mb-1">NO. WHATSAPP</span><span className="text-white font-bold">{profile?.phone}</span></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
