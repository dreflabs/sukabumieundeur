import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Ticket, ShoppingBag, Users, Newspaper, Image as ImageIcon, Settings, LogOut, ShieldCheck, Mic2 } from 'lucide-react';

import { getServerActionAuthOrNull } from '@/lib/auth';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerActionAuthOrNull();
  const isSuperAdmin = auth?.role === 'SUPER_ADMIN';
  const isModuleAdmin = auth?.role === 'MODULE_ADMIN';
  const isOrganiser = auth?.role === 'ORGANISER';

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col font-inter">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand flex items-center justify-center font-outfit font-black text-black text-xl">
            SE
          </div>
          <div className="flex flex-col">
            <span className="font-outfit font-bold text-sm text-white uppercase tracking-widest">CONTROL CONSOLE</span>
            <span className="text-[10px] text-brand font-inter tracking-[0.2em] uppercase">Sukabumi Eundeur Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs text-gray-400 hover:text-white font-inter font-bold uppercase tracking-widest transition-colors">
            PUBLIC SITE
          </Link>
          <Link href="/admin/login" className="bg-[#111] border border-white/10 hover:border-brand text-[10px] font-inter font-bold uppercase tracking-widest px-4 py-2 flex items-center gap-2 text-gray-300 transition-colors">
            <LogOut className="w-3.5 h-3.5 text-brand" /> LOGOUT
          </Link>
        </div>
      </header>

      {/* Main Admin Grid */}
      <div className="flex-grow flex w-full">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/10 p-6 space-y-8 shrink-0 hidden md:block bg-[#0a0a0a]">
          <div className="space-y-2 font-inter text-xs font-bold tracking-widest uppercase">
            <span className="text-[10px] text-gray-500 block mb-4 px-3">MAIN MODULES</span>
            <Link href="/admin" className="flex items-center gap-3 px-3 py-3 bg-brand text-black transition-colors group">
              <LayoutDashboard className="w-4 h-4" /> OVERVIEW
            </Link>
            <Link href="/admin/events" className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:bg-[#111] hover:text-brand transition-colors border border-transparent hover:border-white/5">
              <Ticket className="w-4 h-4" /> TICKETING
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:bg-[#111] hover:text-brand transition-colors border border-transparent hover:border-white/5">
              <ShoppingBag className="w-4 h-4" /> ORDERS
            </Link>
            {(isSuperAdmin || isModuleAdmin) && (
              <Link href="/admin/merch" className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:bg-[#111] hover:text-brand transition-colors border border-transparent hover:border-white/5">
                <ShoppingBag className="w-4 h-4" /> MERCHANDISE
              </Link>
            )}
          </div>
          
          {(isSuperAdmin || isModuleAdmin) && (
            <div className="space-y-2 font-inter text-xs font-bold tracking-widest uppercase">
              <span className="text-[10px] text-gray-500 block mb-4 px-3">CONTENT</span>
              <Link href="/admin/artists" className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:bg-[#111] hover:text-brand transition-colors border border-transparent hover:border-white/5">
                <Mic2 className="w-4 h-4" /> ARTISTS
              </Link>
              <Link href="/admin/news" className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:bg-[#111] hover:text-brand transition-colors border border-transparent hover:border-white/5">
                <Newspaper className="w-4 h-4" /> NEWS
              </Link>
            </div>
          )}

          {(isSuperAdmin || isModuleAdmin) && (
            <div className="space-y-2 font-inter text-xs font-bold tracking-widest uppercase">
              <span className="text-[10px] text-brand block mb-4 px-3">{isSuperAdmin ? 'SUPER ADMIN' : 'ADMINISTRATION'}</span>
              <Link href="/admin/sponsors" className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:bg-[#111] hover:text-brand transition-colors border border-transparent hover:border-white/5">
                <ShieldCheck className="w-4 h-4" /> SPONSORS & PARTNERS
              </Link>
              {isSuperAdmin && (
                <Link href="/admin/users" className="flex items-center gap-3 px-3 py-3 text-gray-400 hover:bg-[#111] hover:text-brand transition-colors border border-transparent hover:border-white/5">
                  <Users className="w-4 h-4" /> SYSTEM USERS
                </Link>
              )}
            </div>
          )}
        </aside>

        {/* Right Admin Content */}
        <main className="flex-grow p-6 md:p-10 space-y-8 bg-[#050505]">
          {children}
        </main>
      </div>
    </div>
  );
}
