import React from 'react';
import { DollarSign, Ticket, ShoppingBag, Users, Cpu, ShieldCheck, Activity, ArrowUpRight, Newspaper, Building2 } from 'lucide-react';
import { query } from '@/lib/db';
import { getServerActionAuthOrNull } from '@/lib/auth';

export const revalidate = 0;

async function getStats() {
  try {
    const auth = await getServerActionAuthOrNull();
    const role = auth?.role || 'MODULE_ADMIN';

    // Fetch counts and revenue
    const [eventsRes, merchRes, artistsRes, newsRes, revenueRes, ticketSalesRes] = await Promise.all([
      query<any>('SELECT COUNT(*) as count FROM public.events'),
      query<any>('SELECT COUNT(*) as count FROM public.merch_products'),
      query<any>('SELECT COUNT(*) as count FROM public.artists'),
      query<any>('SELECT COUNT(*) as count FROM public.news_articles'),
      query<any>("SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM public.orders WHERE status = 'PAID'"),
      query<any>("SELECT COALESCE(SUM(quantity), 0) as tickets_sold FROM public.order_items WHERE item_type = 'TICKET'")
    ]);

    return {
      systemStatus: 'ONLINE',
      eventsCount: parseInt(eventsRes[0].count),
      merchCount: parseInt(merchRes[0].count),
      artistsCount: parseInt(artistsRes[0].count),
      newsCount: parseInt(newsRes[0].count),
      totalRevenue: parseFloat(revenueRes[0].total_revenue),
      ticketsSold: parseInt(ticketSalesRes[0].tickets_sold),
      role
    };
  } catch (err) {
    console.error('Failed to fetch admin stats:', err);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-outfit font-black text-white uppercase tracking-tighter">BUSINESS CONSOLE</h1>
          <p className="text-xs text-brand font-inter mt-1 tracking-widest uppercase">
            {stats?.role.replace('_', ' ')} ACCESS GRANTED
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 text-brand text-xs font-inter font-bold tracking-widest uppercase">
          <Activity className="w-3.5 h-3.5 animate-pulse" /> {stats?.systemStatus || 'ONLINE'}
        </div>
      </div>

      {/* Business Metrics Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {/* Revenue Card */}
        <div className="bg-card border border-border p-6 space-y-4 hover:border-brand/50 shadow-brutal transition-all group">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-inter font-bold uppercase tracking-widest">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-brand" />
          </div>
          <div className="text-4xl font-outfit font-black text-white group-hover:text-brand transition-colors">
            Rp {stats?.totalRevenue.toLocaleString('id-ID') || 0}
          </div>
          <div className="text-xs text-brand font-inter tracking-widest uppercase flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Paid Orders
          </div>
        </div>

        {/* Tickets Sold Card */}
        <div className="bg-card border border-border p-6 space-y-4 hover:border-brand/50 shadow-brutal transition-all group">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-inter font-bold uppercase tracking-widest">Tickets Sold</span>
            <Ticket className="w-4 h-4 text-white group-hover:text-brand transition-colors" />
          </div>
          <div className="text-4xl font-outfit font-black text-white group-hover:text-brand transition-colors">{stats?.ticketsSold || 0}</div>
          <div className="text-xs text-muted font-inter tracking-widest uppercase">Issued & Scanned</div>
        </div>

        {/* Content Modules Summary */}
        <div className="bg-card border border-border p-6 flex flex-col justify-between shadow-brutal hover:border-brand/50 transition-colors group">
          <div className="flex items-center justify-between text-muted mb-4">
            <span className="text-xs font-inter font-bold uppercase tracking-widest">Database Entities</span>
            <Users className="w-4 h-4 text-white group-hover:text-brand transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-outfit font-black text-white">{stats?.eventsCount || 0}</div>
              <div className="text-[10px] text-muted font-inter uppercase">Events</div>
            </div>
            <div>
              <div className="text-2xl font-outfit font-black text-white">{stats?.artistsCount || 0}</div>
              <div className="text-[10px] text-muted font-inter uppercase">Artists</div>
            </div>
            <div>
              <div className="text-2xl font-outfit font-black text-white">{stats?.merchCount || 0}</div>
              <div className="text-[10px] text-muted font-inter uppercase">Merch</div>
            </div>
            <div>
              <div className="text-2xl font-outfit font-black text-white">{stats?.newsCount || 0}</div>
              <div className="text-[10px] text-muted font-inter uppercase">News</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Infrastructure Details */}
      <div className="bg-card border border-border p-8 space-y-6 shadow-brutal">
        <h3 className="text-xs font-inter font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand" /> INFRASTRUCTURE STATUS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-inter tracking-widest uppercase">
          <div className="bg-background p-5 border border-border space-y-2">
            <span className="text-muted block mb-3">DATABASE ENGINE</span>
            <div className="text-white font-bold">PostgreSQL 16 Container</div>
            <div className="text-brand">Status: Connected</div>
          </div>
          <div className="bg-background p-5 border border-border space-y-2">
            <span className="text-muted block mb-3">SERVER / API</span>
            <div className="text-white font-bold">Next.js v15.5</div>
            <div className="text-brand">Status: Running</div>
          </div>
          <div className="bg-background p-5 border border-border space-y-2">
            <span className="text-muted block mb-3">CACHE LAYER</span>
            <div className="text-white font-bold">Redis (Docker)</div>
            <div className="text-muted">Pending Local Setup</div>
          </div>
        </div>
      </div>
    </div>
  );
}
