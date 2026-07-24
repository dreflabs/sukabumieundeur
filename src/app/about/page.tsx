"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#050505] min-h-screen flex flex-col">
      
      {/* Page Hero */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col justify-end pb-16 pt-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=2940&auto=format&fit=crop"
            alt="About Background"
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
            The Movement Profile
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit font-black text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-none"
          >
            ABOUT US
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 container mx-auto px-6 md:px-12 lg:px-24 py-24">
        
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-outfit font-black text-4xl md:text-5xl uppercase text-white mb-8 leading-[1.1]">
              LEBIH DARI <br /> SEKADAR FESTIVAL. <br /> <span className="text-brand">INI ADALAH PERGERAKAN.</span>
            </h2>
            <div className="w-24 h-1 bg-brand mb-8" />
            <p className="font-inter text-gray-300 text-lg mb-6 leading-relaxed">
              Sukabumi Eundeur didirikan sebagai wadah independen untuk merayakan dan memperkuat kancah musik bawah tanah di Sukabumi. Kami percaya bahwa musik bukan sekadar hiburan, melainkan bahasa pemersatu, alat protes, dan katalis perubahan sosial.
            </p>
            <p className="font-inter text-gray-500 text-sm leading-relaxed">
              Selama lebih dari satu dekade, kami telah menyediakan panggung bagi ratusan musisi lokal dari genre Metal, Punk, Hardcore, hingga Hip-hop. Menjembatani gap antara musisi dan audiens, serta membangun ekosistem kreatif yang mandiri dan berkelanjutan.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-square bg-[#111] border border-white/10 p-4"
          >
            <div className="relative w-full h-full overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop"
                alt="Movement Crowd"
                fill
                className="object-cover grayscale mix-blend-screen opacity-80"
              />
            </div>
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand" />
          </motion.div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#111] p-12 border border-white/5 hover:border-brand/50 transition-colors"
          >
            <p className="font-inter font-bold text-brand text-[11px] tracking-[0.2em] uppercase mb-4">01. Vision</p>
            <h3 className="font-outfit font-black text-3xl text-white uppercase mb-6">THE CORE VISION</h3>
            <p className="font-inter text-gray-400 leading-relaxed">
              Menjadi barometer dan pusat ekosistem musik ekstrem serta industri kreatif bawah tanah terbesar di Jawa Barat yang diakui secara global.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#111] p-12 border border-white/5 hover:border-brand/50 transition-colors"
          >
            <p className="font-inter font-bold text-brand text-[11px] tracking-[0.2em] uppercase mb-4">02. Mission</p>
            <h3 className="font-outfit font-black text-3xl text-white uppercase mb-6">THE MISSION</h3>
            <p className="font-inter text-gray-400 leading-relaxed">
              Memberikan fasilitas panggung standar internasional bagi talenta lokal, mengedukasi ekosistem musik, dan mendongkrak perekonomian kolektif melalui *merchandising* dan komunitas.
            </p>
          </motion.div>
        </div>

      </section>
    </div>
  );
}
