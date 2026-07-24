"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, LayoutGrid, Ticket, Search, ArrowRight, Disc3, Mic2, Guitar } from "lucide-react"; 

const communityStats = [
  { id: 1, value: "12K+", label: "MEMBERS" },
  { id: 2, value: "120+", label: "COMMUNITIES" },
  { id: 3, value: "350+", label: "EVENTS HOSTED" },
  { id: 4, value: "50K+", label: "FOLLOWERS" },
];

const subCommunities = [
  { id: 1, name: "METALHEADS SUKABUMI", icon: <Guitar className="text-brand w-8 h-8 mb-4" /> },
  { id: 2, name: "HIP-HOP MOVEMENT", icon: <Mic2 className="text-brand w-8 h-8 mb-4" /> },
  { id: 3, name: "ELECTRONIC SOUND", icon: <Disc3 className="text-brand w-8 h-8 mb-4" /> },
  { id: 4, name: "LOCAL CREATIVES", icon: <LayoutGrid className="text-brand w-8 h-8 mb-4" /> },
];

export default function CommunityPage() {
  return (
    <div className="w-full bg-background min-h-screen flex flex-col">
      
      {/* Page Hero */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col justify-end pb-16 pt-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2940&auto=format&fit=crop"
            alt="Community Background"
            fill
            className="object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            className="font-inter font-bold text-brand text-xs tracking-[0.2em] uppercase mb-4"
          >
            The Movement
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit font-black text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-none"
          >
            COMMUNITY
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 container mx-auto px-6 md:px-12 lg:px-24 py-24">
        
        {/* Intro & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          
          <div className="flex flex-col">
            <h2 className="font-outfit font-black text-3xl md:text-5xl uppercase text-white mb-6">
              TOGETHER <br /> WE GROW
            </h2>
            <p className="font-inter text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
              Sukabumi Eundeur bukan sekadar festival musik, ini adalah ekosistem. Kami mewadahi berbagai sub-kultur dari metal, punk, hip-hop, hingga pegiat seni visual untuk bersatu, berkolaborasi, dan menggetarkan tanah air.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              {communityStats.map((stat, i) => (
                <div key={stat.id} className="flex flex-col">
                  <span className="font-outfit font-black text-4xl text-brand uppercase tracking-tighter mb-1">
                    {stat.value}
                  </span>
                  <span className="font-inter font-bold text-gray-400 text-xs uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-surface-2 p-8 md:p-12 border border-white/5 relative overflow-hidden group">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand opacity-5 blur-[100px] rounded-full pointer-events-none" />
            
            <h3 className="font-outfit font-black text-2xl uppercase text-white mb-2">JOIN THE ECOSYSTEM</h3>
            <p className="font-inter text-gray-400 text-sm mb-8">
              Jadilah bagian dari pergerakan. Dapatkan akses ke forum eksklusif, tiket presale, dan diskusi kolaborasi.
            </p>
            
            <form className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="FULL NAME"
                className="w-full bg-surface-1 border border-white/10 text-white text-xs px-4 py-4 outline-none focus:border-brand transition-colors uppercase tracking-widest font-inter"
              />
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS"
                className="w-full bg-surface-1 border border-white/10 text-white text-xs px-4 py-4 outline-none focus:border-brand transition-colors uppercase tracking-widest font-inter"
              />
              <select className="w-full bg-surface-1 border border-white/10 text-gray-400 text-xs px-4 py-4 outline-none focus:border-brand transition-colors uppercase tracking-widest font-inter appearance-none">
                <option value="">SELECT YOUR INTEREST</option>
                <option value="musician">MUSICIAN / BAND</option>
                <option value="visual_artist">VISUAL ARTIST</option>
                <option value="promoter">PROMOTER / EVENT</option>
                <option value="enthusiast">MUSIC ENTHUSIAST</option>
              </select>
              
              <button 
                type="button" 
                disabled
                className="mt-4 flex items-center justify-between w-full px-6 py-4 bg-brand hover:bg-white disabled:bg-surface-2 disabled:text-gray-500 disabled:border-transparent text-black font-inter font-bold text-xs uppercase tracking-widest transition-colors cursor-not-allowed"
              >
                REGISTRATION OPENING SOON
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Sub-Communities */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-outfit font-black text-3xl md:text-4xl uppercase text-white">SUB-COMMUNITIES</h2>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subCommunities.map((sub, i) => (
              <motion.div 
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-8 bg-surface-2 border border-white/5 hover:border-brand/50 transition-colors cursor-pointer text-center group"
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  {sub.icon}
                </div>
                <h3 className="font-outfit font-bold text-gray-300 group-hover:text-white uppercase text-lg transition-colors">
                  {sub.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
