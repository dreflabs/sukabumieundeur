"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function TicketCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={containerRef} className="w-full bg-background pb-24 overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="relative w-full h-[400px] md:h-[500px] bg-surface-2 overflow-hidden group border border-surface-3 hover:border-brand/30 transition-colors duration-500">
          {/* Parallax Background */}
          <motion.div style={{ y }} className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=2000&auto=format&fit=crop"
              alt="Crowd Surfing"
              fill
              className="object-cover opacity-50 grayscale mix-blend-screen"
            />
          </motion.div>

          {/* Brutalist Decorative Vector */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-80 flex items-center justify-end pr-12 lg:pr-24">
             <svg width="350" height="350" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand">
                {/* Brutalist Star / Starburst */}
                <path d="M200 20 L220 160 L380 180 L230 220 L240 370 L180 230 L30 250 L160 180 L120 40 L190 160 Z" stroke="currentColor" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter" className="drop-shadow-[5px_5px_0px_rgba(64,255,1,0.6)]" />
                {/* Crosshairs */}
                <path d="M200 150 L200 250 M150 200 L250 200" stroke="currentColor" strokeWidth="4" />
                {/* Scratch marks */}
                <path d="M280 80 L340 40 M290 90 L360 60" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
             </svg>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-16 lg:p-24 w-full md:w-2/3">
            <h2 className="font-outfit font-black text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[1.1] mb-4">
              GET YOUR TICKET <br /> FEEL THE EXPERIENCE
            </h2>
            <p className="font-inter text-gray-300 text-sm md:text-base max-w-md mb-8">
              Jangan lewatkan festival musik dan budaya terbesar di Sukabumi.
            </p>
            <div>
              <MagneticButton className="inline-block">
                <Link 
                  href="/tickets" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-brand hover:bg-white text-black font-inter font-bold text-sm uppercase tracking-widest transition-colors shadow-brutal shadow-brutal-hover"
                >
                  GET TICKET NOW
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
