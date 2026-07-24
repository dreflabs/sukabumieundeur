import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const sizeMap = {
    sm: {
      box: 'w-8 h-8 text-sm',
      title: 'text-base',
      subtitle: 'text-[9px]'
    },
    md: {
      box: 'w-10 h-10 text-xl',
      title: 'text-lg',
      subtitle: 'text-[10px]'
    },
    lg: {
      box: 'w-14 h-14 text-3xl',
      title: 'text-2xl',
      subtitle: 'text-xs'
    }
  };

  const s = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded cursor-pointer ${className}`}>
      <div className={`${s.box} bg-gradient-to-br from-red-600 via-red-700 to-red-950 rounded-md flex items-center justify-center font-black text-black tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500/40 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all duration-300 relative overflow-hidden`}>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        SE
      </div>
      <div>
        <span className={`font-black ${s.title} tracking-widest text-white block uppercase group-hover:text-red-500 transition-colors duration-300 font-outfit`}>
          Sukabumi Eundeur
        </span>
        <span className={`${s.subtitle} text-zinc-400 font-mono tracking-widest uppercase block -mt-1 font-bold group-hover:text-zinc-300 transition-colors`}>
          Heavy Music Ecosystem
        </span>
      </div>
    </div>
  );
}
