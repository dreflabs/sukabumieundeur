import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Ticket, ShoppingBag, Users, Newspaper, Image as ImageIcon, Settings, LogOut, ShieldCheck } from 'lucide-react';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded flex items-center justify-center font-black text-black text-lg">
            SE
          </div>
          <div>
            <span className="font-bold text-sm text-white uppercase tracking-wider block">CMS SUPER ADMIN PANEL</span>
            <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase block -mt-1">Sukabumi Eundeur Control Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white font-mono uppercase tracking-wider">
            Public Website
          </Link>
          <Link href="/login" className="bg-zinc-900 border border-zinc-800 hover:border-red-600 text-xs font-mono px-3 py-1.5 rounded flex items-center gap-1.5 text-zinc-300">
            <LogOut className="w-3.5 h-3.5 text-red-500" /> Logout
          </Link>
        </div>
      </header>

      {/* Main Admin Grid */}
      <div className="flex-grow flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-zinc-800 p-4 space-y-6 shrink-0 hidden md:block">
          <div className="space-y-1 text-xs font-mono">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest px-3 block mb-2 font-bold">Main Console</span>
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded bg-red-600 text-white font-bold transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Overview Dashboard
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" /> Order & Transaksi
            </Link>
            <Link href="/tickets" className="flex items-center gap-3 px-3 py-2 rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <Ticket className="w-4 h-4" /> Events & Ticketing
            </Link>
            <Link href="/news" className="flex items-center gap-3 px-3 py-2 rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <Newspaper className="w-4 h-4" /> News & Articles
            </Link>
            <Link href="/gallery" className="flex items-center gap-3 px-3 py-2 rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <ImageIcon className="w-4 h-4" /> Media Library
            </Link>
            <Link href="/community" className="flex items-center gap-3 px-3 py-2 rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <Users className="w-4 h-4" /> Users & Community
            </Link>
          </div>
        </aside>

        {/* Right Admin Content */}
        <main className="flex-grow p-6 md:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
