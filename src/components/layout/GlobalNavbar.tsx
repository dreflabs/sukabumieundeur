"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, User } from "lucide-react"; // Assume lucide-react is installed, if not we can use SVG

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "EVENTS", href: "/events" },
  { name: "ARTISTS", href: "/artists" },
  { name: "NEWS", href: "/news" },
  { name: "COMMUNITY", href: "/community" },
  { name: "STORE", href: "/store" },
  { name: "ABOUT", href: "/about" },
];

export default function GlobalNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-surface-2/80 backdrop-blur-md py-4 border-b border-surface-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          {/* Logo Icon (Green stylized S/E block) */}
          <div className="text-brand">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 8H32V12H12V8ZM8 16H28V20H8V16ZM12 24H32V28H12V24ZM8 32H28V36H8V32Z" fill="currentColor"/>
              <rect x="2" y="8" width="4" height="28" fill="currentColor"/>
            </svg>
          </div>
          <div className="flex flex-col items-start leading-[1.1]">
            <span className="font-outfit font-black text-[15px] uppercase tracking-wide text-white">
              SUKABUMI
            </span>
            <span className="font-outfit font-black text-[15px] uppercase tracking-wide text-white">
              EUNDEUR
            </span>
            <span className="font-outfit font-black text-[15px] uppercase tracking-wide text-white">
              INDONESIA
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[13px] font-inter font-bold uppercase tracking-widest transition-colors ${
                link.name === "HOME" ? "text-brand" : "text-white hover:text-brand"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-brand hover:text-brand transition-colors">
            <Search size={16} />
          </button>
          <Link href="/dashboard" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-brand hover:text-brand transition-colors">
            <User size={16} />
          </Link>
          <Link
            href="/tickets"
            className="px-6 py-2.5 font-inter font-bold text-[13px] uppercase tracking-widest text-black bg-brand hover:bg-white transition-colors"
          >
            GET TICKET
          </Link>
        </div>

        {/* Mobile Menu Button - Minimal */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden relative z-50 p-2 text-white"
        >
          <div className="flex flex-col gap-1.5 items-end">
            <span className={`w-8 h-[2px] bg-current block transition-all ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`w-6 h-[2px] bg-current block transition-all ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-8 h-[2px] bg-current block transition-all ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 pb-6 flex flex-col justify-between lg:hidden"
        >
          <nav className="flex flex-col gap-6 mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-outfit font-black uppercase tracking-widest transition-colors ${
                  link.name === "HOME" ? "text-brand" : "text-white hover:text-brand"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex flex-col gap-4 mt-12 border-t border-white/10 pt-6">
            <Link
              href="/tickets"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-6 py-4 font-inter font-bold text-sm uppercase tracking-widest text-black bg-brand hover:bg-white transition-colors"
            >
              GET TICKET
            </Link>
            <div className="flex items-center gap-4">
              <button className="flex-1 rounded-full border border-white/20 py-3 flex items-center justify-center text-white hover:border-brand hover:text-brand transition-colors">
                <Search size={20} />
              </button>
              <Link href="/dashboard" className="flex-1 rounded-full border border-white/20 py-3 flex items-center justify-center text-white hover:border-brand hover:text-brand transition-colors">
                <User size={20} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
