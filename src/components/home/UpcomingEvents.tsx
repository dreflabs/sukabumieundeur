"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/events')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const mappedEvents = data.data.slice(0, 4).map((evt: any) => {
            const dateObj = new Date(evt.start_date);
            return {
              id: evt.id,
              title: evt.title,
              location: `${evt.venue}, ${evt.city}`,
              date: dateObj.getDate().toString().padStart(2, '0'),
              month: dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
              image: evt.poster_image_url || 'https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=800&auto=format&fit=crop'
            };
          });
          setEvents(mappedEvents);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (events.length === 0) return null;

  return (
    <section className="w-full bg-background py-24 border-t border-surface-3">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="font-inter font-bold text-brand text-[11px] tracking-[0.2em] uppercase mb-2">
              Upcoming Events
            </p>
            <h2 className="font-outfit font-black text-4xl md:text-5xl uppercase text-white">
              WHAT'S NEXT
            </h2>
          </div>
          <Link href="/events" className="mt-4 md:mt-0 font-inter font-bold text-brand text-[11px] tracking-[0.2em] uppercase hover:text-white transition-colors flex items-center gap-2">
            VIEW ALL EVENTS 
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, i) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex flex-col gap-4 cursor-pointer"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-surface-2 border border-surface-3 group-hover:border-brand/50 transition-colors">
                {/* Date Badge */}
                <div className="absolute top-0 left-0 bg-brand px-3 py-2 z-10 flex flex-col items-center justify-center">
                  <span className="font-outfit font-black text-black text-lg leading-none">{event.date}</span>
                  <span className="font-inter font-bold text-black text-[10px] uppercase leading-none mt-1">{event.month}</span>
                </div>
                {/* Image */}
                <Image 
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-outfit font-black text-xl text-white uppercase group-hover:text-brand transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-inter text-gray-400 text-xs tracking-wider">
                    {event.location}
                  </p>
                  <svg className="text-brand opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
