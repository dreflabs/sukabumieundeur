'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, Ticket, ShoppingBag, Users, Cpu, ShieldCheck, Activity, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/v1/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-500">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p>Memuat statistik admin console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">OVERVIEW CONTROL CONSOLE</h1>
          <p className="text-xs text-zinc-400 font-mono">Real-time Metrik Kinerja Ekosistem Platform Sukabumi Eundeur.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" /> {stats?.systemStatus}
        </div>
      </div>

      {/* Analytics Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-mono uppercase tracking-widest">Total Pendapatan</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{formatRupiah(stats?.totalRevenue || 0)}</div>
          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% dari bulan lalu
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-mono uppercase tracking-widest">Tiket Terjual</span>
            <Ticket className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats?.ticketsSold} Tiket</div>
          <div className="text-[10px] text-zinc-500 font-mono">Sisa kuota: {stats?.quotaRemaining} tiket</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-mono uppercase tracking-widest">Pesanan Merch</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats?.merchOrders} Pesanan</div>
          <div className="text-[10px] text-amber-400 font-mono">12 Pesanan siap kirim</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-mono uppercase tracking-widest">Total Member</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats?.totalUsers} Users</div>
          <div className="text-[10px] text-blue-400 font-mono">+45 Member minggu ini</div>
        </div>
      </div>

      {/* System Infrastructure Details */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-500" /> Status Infrastruktur Self-Hosted VPS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-1">
            <span className="text-zinc-500">DATABASE ENGINE</span>
            <div className="text-white font-bold">PostgreSQL 16 Containerized</div>
            <div className="text-[10px] text-emerald-400">Port 127.0.0.1:5432 (Local Only)</div>
          </div>
          <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-1">
            <span className="text-zinc-500">LOCK CACHE MANAGER</span>
            <div className="text-white font-bold">Redis 7 Lock Manager</div>
            <div className="text-[10px] text-emerald-400">15-Min Ticket Hold Active</div>
          </div>
          <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-1">
            <span className="text-zinc-500">APP PROCESS MANAGER</span>
            <div className="text-white font-bold">PM2 Cluster (Next.js 16)</div>
            <div className="text-[10px] text-emerald-400">Nginx Proxy Port 3000</div>
          </div>
        </div>
      </div>
    </div>
  );
}
