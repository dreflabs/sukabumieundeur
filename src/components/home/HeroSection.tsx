"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { DEFAULT_HERO_BG } from "@/lib/constants";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-[100svh] min-h-[700px] flex items-center overflow-hidden bg-background">
      {/* Background Image with Parallax */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <Image
          src={DEFAULT_HERO_BG}
          alt="Sukabumi Eundeur Festival Crowd"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60 mix-blend-screen"
        />
        {/* Heavy Black Gradient Overlay to match reference without muddying */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
      </motion.div>

      {/* Vertical Side Texts */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-24 z-20 mix-blend-difference">
        <span className="[writing-mode:vertical-lr] rotate-180 font-inter text-xs font-bold tracking-[0.2em] text-brand uppercase">
          Scroll to explore
        </span>
        <div className="w-[1px] h-16 bg-brand" />
      </div>

      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-12 z-20 mix-blend-difference">
        {["INSTAGRAM", "TIKTOK", "YOUTUBE", "SPOTIFY"].map((social) => (
          <Link key={social} href="#" className="[writing-mode:vertical-lr] rotate-180 font-inter text-xs font-bold tracking-[0.2em] text-white hover:text-brand transition-colors uppercase">
            {social}
          </Link>
        ))}
      </div>

      <div className="container relative z-20 mx-auto px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between mt-16">
        
        {/* Left Content */}
        <motion.div style={{ opacity }} className="flex flex-col items-start w-full lg:w-2/3 max-w-3xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="font-inter font-bold text-brand text-sm md:text-base tracking-[0.2em] uppercase mb-4"
          >
            DISTORSI. KULTUR. PERGERAKAN.
          </motion.p>
          
          <h1 className="flex flex-col items-start mb-6">
            <motion.span 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
              className="block font-outfit font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-none"
            >
              THE ROAR OF
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
              className="block font-outfit font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-none -mt-1 md:-mt-3 lg:-mt-4"
            >
              SUKABUMI
            </motion.span>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, originX: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.6 }}
              className="bg-brand px-4 py-1 mt-2 mb-2 md:mt-4 md:mb-4"
            >
              <span className="block font-outfit font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-black leading-none">
                UNITED BY
              </span>
            </motion.div>
            <motion.span 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.7 }}
              className="block font-outfit font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-transparent [-webkit-text-stroke:2px_var(--color-brand)] leading-none mt-1 md:mt-2"
            >
              EUNDEUR
            </motion.span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.9 }}
            className="font-inter text-gray-300 text-lg md:text-xl max-w-lg mb-10 leading-relaxed uppercase tracking-wider text-sm"
          >
            Dari kebisingan jalanan hingga gemuruh panggung utama. Sukabumi Eundeur bukan sekadar festival, ini adalah jantung pergerakan musik bawah tanah Jawa Barat.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <MagneticButton className="inline-block">
              <Link href="/events" className="flex items-center gap-3 px-8 py-4 bg-brand hover:bg-white text-black font-inter font-bold text-sm uppercase tracking-widest transition-colors">
                SEE THE LINEUP
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </MagneticButton>
            <MagneticButton className="inline-block">
              <Link href="/about" className="px-8 py-4 border border-white/30 hover:border-brand hover:text-brand text-white font-inter font-bold text-sm uppercase tracking-widest transition-colors flex items-center justify-center">
                KNOW THE MOVEMENT
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Right Content (Floating Card) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ opacity }}
          className="hidden lg:flex flex-col items-end w-1/3"
        >
          <div className="border border-surface-3 bg-surface-2/80 backdrop-blur-md p-8 pt-12 relative w-full max-w-sm group hover:border-brand/50 transition-colors">
            {/* Top Left Decoration */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand -translate-x-[2px] -translate-y-[2px]" />
            {/* Top Right Decoration */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand translate-x-[2px] -translate-y-[2px]" />
            
            <p className="font-inter font-bold text-brand text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              NEXT EVENT
            </p>
            <h2 className="font-outfit font-black text-4xl uppercase text-white mb-2">
              EUNDEUR <br/> FEST 2025
            </h2>
            <p className="font-inter text-gray-400 text-sm mb-6 uppercase tracking-wider">
              12 - 14 SEPT 2025 <br/>
              SUKABUMI, INDONESIA
            </p>
            <Link href="/events/eundeur-fest-2025" className="font-inter font-bold text-brand text-[13px] tracking-widest uppercase flex items-center gap-2 group-hover:text-white transition-colors">
              VIEW DETAILS
              <svg className="group-hover:translate-x-2 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
