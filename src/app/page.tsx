import React from 'react';
import { Calendar, MapPin, Ticket, Flame, ArrowRight, ShieldCheck, Cpu, Database } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col font-sans">
      {/* 🟢 NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-md flex items-center justify-center font-black text-xl text-black tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.6)]">
            SE
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-widest text-white block uppercase">Sukabumi Eundeur</span>
            <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase block -mt-1">Heavy Music Ecosystem</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#festival" className="hover:text-red-500 transition-colors">Festival</a>
          <a href="#tickets" className="hover:text-red-500 transition-colors">Ticketing</a>
          <a href="#merch" className="hover:text-red-500 transition-colors">Merchandise</a>
          <a href="#news" className="hover:text-red-500 transition-colors">News</a>
          <a href="#community" className="hover:text-red-500 transition-colors">Komunitas</a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#tickets"
            className="bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-bold tracking-wider px-5 py-2.5 rounded shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" /> Beli Tiket
          </a>
        </div>
      </header>

      {/* 🔴 HERO SECTION */}
      <section className="relative py-28 px-6 text-center overflow-hidden border-b border-zinc-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#0a0a0c] to-[#0a0a0c]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-red-400 text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 animate-pulse text-red-500" /> 100% Self-Hosted VPS Ecosystem 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase text-white leading-none">
            SUKABUMI <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-amber-500">EUNDEUR</span> FEST
          </h1>

          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-normal">
            Pusat Ekosistem Musik Heavy Metal & Underground Culture Sukabumi. Tiket Resmi, E-Commerce Merchandise, Portal Berita & Komunitas Terintegrasi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded">
              <Calendar className="w-4 h-4 text-red-500" /> 15 AGUSTUS 2026
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded">
              <MapPin className="w-4 h-4 text-red-500" /> STADION SURAJAYA SUKABUMI
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#tickets"
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wider rounded shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2"
            >
              Amankan Tiket Sekarang <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#merch"
              className="w-full sm:w-auto px-8 py-3.5 border border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 text-zinc-300 font-semibold text-sm uppercase tracking-wider rounded transition-all"
            >
              Lihat Official Merch
            </a>
          </div>
        </div>
      </section>

      {/* 🎫 TICKET WAR SECTION */}
      <section id="tickets" className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-white">
            Kategori <span className="text-red-500">Tiket Festival</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Sistem Ticket Lock dengan jaminan Anti Race Condition & Perlindungan Kuota 15 Menit.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Ticket 1 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6 flex flex-col justify-between hover:border-red-600/50 transition-all">
            <div className="space-y-4">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">Phase 1 — Early Bird</span>
              <h3 className="text-xl font-bold text-white uppercase">UNDERGROUND PASS</h3>
              <div className="text-3xl font-black text-red-500">Rp 75.000 <span className="text-xs text-zinc-500 font-normal">/ tiket</span></div>
              <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-800 pt-4">
                <li className="flex items-center gap-2">✓ Akses All Stage Festival</li>
                <li className="flex items-center gap-2">✓ Free Official Sticker Set</li>
                <li className="flex items-center gap-2 text-zinc-600">✗ Exclusive Fest T-Shirt</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 bg-zinc-800 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors">
              Pesan Sekarang
            </button>
          </div>

          {/* Ticket 2 (Popular) */}
          <div className="bg-zinc-900/90 border-2 border-red-600 rounded-lg p-6 flex flex-col justify-between relative shadow-[0_0_30px_rgba(220,38,38,0.2)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Paling Populer
            </div>
            <div className="space-y-4">
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest block">Phase 2 — Presale</span>
              <h3 className="text-xl font-bold text-white uppercase">MOSHPIT VIP PASS</h3>
              <div className="text-3xl font-black text-red-500">Rp 150.000 <span className="text-xs text-zinc-500 font-normal">/ tiket</span></div>
              <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-800 pt-4">
                <li className="flex items-center gap-2">✓ Front Row Moshpit Access</li>
                <li className="flex items-center gap-2">✓ Official Festival Poster</li>
                <li className="flex items-center gap-2">✓ Fast-Track QR Check-in</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-md">
              Beli Tiket Presale
            </button>
          </div>

          {/* Ticket 3 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6 flex flex-col justify-between hover:border-red-600/50 transition-all">
            <div className="space-y-4">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">Ultimate Bundle</span>
              <h3 className="text-xl font-bold text-white uppercase">EUNDEUR ALL ACCESS</h3>
              <div className="text-3xl font-black text-red-500">Rp 300.000 <span className="text-xs text-zinc-500 font-normal">/ tiket</span></div>
              <ul className="text-xs text-zinc-400 space-y-2 border-t border-zinc-800 pt-4">
                <li className="flex items-center gap-2">✓ VIP Lounge & Backstage Tour</li>
                <li className="flex items-center gap-2">✓ Official Festival T-Shirt</li>
                <li className="flex items-center gap-2">✓ Meet & Greet Headliner Band</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 bg-zinc-800 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors">
              Pesan All Access
            </button>
          </div>
        </div>
      </section>

      {/* 🛍️ MERCHANDISE SECTION */}
      <section id="merch" className="py-16 px-6 bg-zinc-950/60 border-t border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-mono text-red-500 tracking-widest uppercase block mb-1">Official E-Commerce</span>
              <h2 className="text-3xl font-extrabold text-white uppercase">Sukabumi Eundeur Merch</h2>
            </div>
            <a href="#merch" className="text-xs text-red-400 hover:text-red-300 font-mono tracking-wider uppercase mt-4 md:mt-0 flex items-center gap-1">
              Lihat Semua Catalog <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-zinc-900 border border-zinc-800 rounded p-4 group hover:border-zinc-700 transition-all">
                <div className="aspect-square bg-zinc-950 rounded mb-4 flex items-center justify-center text-zinc-700 font-mono text-xs">
                  [MERCH ITEM {item}]
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block">Heavy Apparel</span>
                <h4 className="text-sm font-bold text-white uppercase mt-1 group-hover:text-red-500 transition-colors">Official Heavy Heavy T-Shirt v{item}</h4>
                <div className="text-xs font-mono text-red-400 mt-2">Rp 185.000</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛡️ FOOTER */}
      <footer className="mt-auto border-t border-zinc-800 py-10 px-6 bg-[#0a0a0c]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-zinc-400">
              <Database className="w-4 h-4 text-red-500" /> PostgreSQL 16
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <Cpu className="w-4 h-4 text-red-500" /> Self-Hosted VPS
            </div>
          </div>
          <div>
            © 2026 Sukabumi Eundeur Ecosystem. Powered by Next.js 16 & Self-Hosted PostgreSQL.
          </div>
        </div>
      </footer>
    </div>
  );
}
