import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function GlobalFooter() {
  return (
    <footer className="w-full bg-[#050505] pt-24 pb-8 border-t border-white/10 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Logo & Description (Left Column - span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <BrandLogo size="lg" className="filter grayscale hover:grayscale-0 transition-all duration-300" />
            </Link>
            <p className="font-inter text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
              Ekosistem musik, budaya, dan kreativitas yang menghubungkan komunitas dan menggerakkan perubahan.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-brand transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              <a href="#" className="hover:text-brand transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
              <a href="#" className="hover:text-brand transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg></a>
            </div>
          </div>

          {/* EXPLORE (span 2) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-inter font-bold text-white text-[13px] uppercase tracking-widest mb-6">EXPLORE</h4>
            <div className="flex flex-col gap-3">
              {['Events', 'Artists', 'News', 'Community', 'Store'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="font-inter text-gray-400 text-sm hover:text-brand transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* SUPPORT (span 2) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-inter font-bold text-white text-[13px] uppercase tracking-widest mb-6">SUPPORT</h4>
            <div className="flex flex-col gap-3">
              {['Help Center', 'Contact Us', 'FAQ', 'Privacy Policy', 'Terms & Conditions'].map(item => (
                <span key={item} className="font-inter text-gray-600 text-sm cursor-not-allowed">
                  {item} <span className="text-[10px] ml-1">(Soon)</span>
                </span>
              ))}
            </div>
          </div>

          {/* ABOUT (span 2) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-inter font-bold text-white text-[13px] uppercase tracking-widest mb-6">ABOUT</h4>
            <div className="flex flex-col gap-3">
              {['About Eundeur', 'Our Mission', 'Partnership', 'Media Kit', 'Careers'].map(item => (
                <span key={item} className="font-inter text-gray-600 text-sm cursor-not-allowed">
                  {item} <span className="text-[10px] ml-1">(Soon)</span>
                </span>
              ))}
            </div>
          </div>

          {/* NEWSLETTER (span 2) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-inter font-bold text-white text-[13px] uppercase tracking-widest mb-6">NEWSLETTER</h4>
            <p className="font-inter text-gray-400 text-sm mb-4">
              Dapatkan informasi terbaru seputar event, berita, dan program Eundeur.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-[#111] border border-[#222] text-white text-sm px-4 py-3 outline-none w-full focus:border-brand transition-colors"
              />
              <button className="bg-brand hover:bg-white text-black px-4 flex items-center justify-center transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs font-inter text-gray-500">
          <p>© 2025 Sukabumi Eundeur Indonesia. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with <span className="text-red-500">♥</span> for Sukabumi</p>
        </div>

      </div>
    </footer>
  );
}
