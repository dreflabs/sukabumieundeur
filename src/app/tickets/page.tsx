export const dynamic = 'force-dynamic';
import React from 'react';
import { Flame, Calendar, MapPin } from 'lucide-react';
import TicketClient from '@/components/tickets/TicketClient';
import Script from 'next/script';

async function getTicketsData() {
  try {
    const [eventRes, categoriesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1/events`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1/tickets/categories`, { cache: 'no-store' })
    ]);

    const eventData = await eventRes.json();
    const categoriesData = await categoriesRes.json();

    return {
      event: eventData.success && eventData.data.length > 0 ? eventData.data[0] : null,
      categories: categoriesData.success ? categoriesData.data : []
    };
  } catch (err) {
    console.error('Failed to fetch ticket data:', err);
    return { event: null, categories: [] };
  }
}

export async function generateMetadata() {
  return {
    title: 'Tiket Sukabumi Eundeur Fest 2026 - Festival Metal Terbesar',
    description: 'Beli tiket resmi Sukabumi Eundeur Fest 2026. Jangan sampai kehabisan presale dan VIP moshpit pass untuk konser underground terbaik tahun ini.',
  };
}

export default async function TicketsPage() {
  const { event, categories } = await getTicketsData();

  const jsonLd = event ? {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: event.title,
    startDate: event.start_date,
    endDate: event.end_date,
    image: event.poster_image_url || 'https://sukabumieundeur.com/og-image.jpg',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: event.city
    },
    url: 'https://eundeur.com/tickets',
    offers: categories.map((cat: any) => ({
      '@type': 'Offer',
      name: cat.name,
      price: cat.price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      url: 'https://eundeur.com/tickets'
    }))
  } : null;

  return (
    <div className="w-full flex flex-col font-sans">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Midtrans Snap Script for Ticketing Payment */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DUMMYKEY'}
        strategy="lazyOnload"
      />

      {/* Editorial Hero Header */}
      <section className="relative py-24 px-6 border-b border-white/10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-2 via-background to-background overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto space-y-6 fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none border border-brand/30 bg-brand/10 backdrop-blur-md text-brand text-xs font-mono tracking-widest uppercase shadow-brutal">
            <Flame className="w-3.5 h-3.5 text-brand animate-pulse" /> Official Ticket War Portal 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase text-white tracking-tighter font-outfit leading-none drop-shadow-xl">
            TIKET FESTIVAL<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand/70">SUKABUMI EUNDEUR</span>
          </h1>

          {event && (
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur border border-white/10 px-4 py-2.5 rounded-none shadow-brutal">
                <Calendar className="w-4 h-4 text-brand" /> <span className="font-bold text-white">15 AGUSTUS 2026</span>
              </div>
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur border border-white/10 px-4 py-2.5 rounded-none shadow-brutal">
                <MapPin className="w-4 h-4 text-brand" /> <span className="font-bold text-white uppercase">{event.venue}, {event.city}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Ticket Grid via Client Component */}
      <main className="py-16 px-6 max-w-6xl mx-auto w-full flex-grow">
        <TicketClient initialCategories={categories} />
      </main>
    </div>
  );
}
