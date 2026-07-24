"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarX } from "lucide-react";

type Event = {
  id: string;
  title: string;
  location: string;
  date: string;
  month: string;
  year?: string;
  image: string;
  description: string;
};

export default function EventsClient({ upcomingEvents, pastEvents }: { upcomingEvents: Event[], pastEvents: Event[] }) {
  return (
    <div className="w-full bg-[#050505] min-h-screen flex flex-col">
      {/* Page Hero */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col justify-end pb-16 pt-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=2940&auto=format&fit=crop"
            alt="Events Background"
            fill
            className="object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-inter font-bold text-brand text-[11px] tracking-[0.2em] uppercase mb-4"
          >
            Calendar
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-none"
          >
            EVENTS
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 container mx-auto px-6 md:px-12 lg:px-24 py-24">
        
        {/* Upcoming Events */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-outfit font-black text-3xl md:text-4xl uppercase text-white">UPCOMING</h2>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          {upcomingEvents.length === 0 ? (
            <EmptyState 
              icon={CalendarX}
              title="Tidak Ada Event Mendatang"
              description="Belum ada event yang dijadwalkan dalam waktu dekat. Pantau terus info terbaru dari Sukabumi Eundeur."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {upcomingEvents.map((event, i) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="group flex flex-col md:flex-row bg-[#111] border border-white/5 hover:border-brand/50 transition-colors overflow-hidden"
                >
                  <div className="relative w-full md:w-2/5 aspect-square md:aspect-auto overflow-hidden">
                    <div className="absolute top-0 left-0 bg-brand px-4 py-3 z-10 flex flex-col items-center justify-center border-b border-r border-black">
                      <span className="font-outfit font-black text-black text-2xl leading-none">{event.date}</span>
                      <span className="font-inter font-bold text-black text-xs uppercase leading-none mt-1">{event.month}</span>
                    </div>
                    <Image 
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                    />
                  </div>
                  
                  <div className="flex flex-col justify-center p-8 w-full md:w-3/5">
                    <h3 className="font-outfit font-black text-2xl text-white uppercase mb-2 group-hover:text-brand transition-colors leading-tight">
                      {event.title}
                    </h3>
                    <p className="font-inter font-bold text-gray-500 text-[11px] tracking-widest uppercase mb-4 flex items-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {event.location}
                    </p>
                    <p className="font-inter text-gray-400 text-sm mb-8 line-clamp-2">
                      {event.description}
                    </p>
                    <Link href="/tickets" className="mt-auto self-start inline-flex items-center gap-3 px-6 py-3 border border-white/20 hover:border-brand hover:text-brand text-white font-inter font-bold text-xs uppercase tracking-widest transition-colors">
                      GET TICKETS
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="font-outfit font-black text-3xl md:text-4xl uppercase text-gray-600">ARCHIVE</h2>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastEvents.map((event, i) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group flex flex-col gap-4 cursor-pointer"
                >
                  <div className="relative w-full aspect-video overflow-hidden bg-[#111] border border-white/5 group-hover:border-white/30 transition-colors">
                    <div className="absolute inset-0 bg-black/60 z-10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-4 left-4 z-20">
                      <p className="font-inter font-bold text-gray-300 text-[10px] tracking-widest uppercase bg-black/80 px-2 py-1">
                        {event.date} {event.month} {event.year}
                      </p>
                    </div>
                    <Image 
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-outfit font-black text-xl text-gray-400 uppercase group-hover:text-white transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
