"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const stats = [
  { id: 1, value: "RIBUAN", label: "MEMBER" },
  { id: 2, value: "120+", label: "COMMUNITIES" },
  { id: 3, value: "350+", label: "EVENTS" },
  { id: 4, value: "50K+", label: "FOLLOWERS" },
];

export default function CommunityStats() {
  return (
    <section className="w-full bg-background py-24 border-t border-surface-3">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          
          {/* Left Text */}
          <div className="flex flex-col w-full lg:w-1/4">
            <p className="font-inter font-bold text-brand text-xs tracking-[0.2em] uppercase mb-2">
              Community
            </p>
            <h2 className="font-outfit font-black text-4xl md:text-5xl uppercase text-white mb-4">
              BERGERAK <br className="hidden lg:block"/> BERSAMA
            </h2>
            <p className="font-inter text-gray-400 text-sm max-w-sm">
              Bergabung dengan komunitas kreatif, musisi, seniman, dan penikmat budaya di Sukabumi dan sekitarnya.
            </p>
          </div>

          {/* Stats Middle */}
          <div className="flex flex-wrap lg:flex-nowrap justify-between w-full lg:w-2/4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center flex-1 min-w-[100px]"
              >
                <div className="text-brand font-black text-2xl mb-2">/</div>
                <span className="font-outfit font-black text-4xl md:text-5xl text-brand uppercase tracking-tighter mb-1">
                  {stat.value}
                </span>
                <span className="font-inter font-bold text-gray-400 text-xs uppercase tracking-widest">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Right Button */}
          <div className="flex justify-start lg:justify-end w-full lg:w-1/4 mt-4 lg:mt-0">
            <Link 
              href="/community" 
              className="flex items-center gap-3 px-8 py-4 bg-brand hover:bg-white text-black font-inter font-bold text-sm uppercase tracking-widest transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand"
            >
              GABUNG PERGERAKAN
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
