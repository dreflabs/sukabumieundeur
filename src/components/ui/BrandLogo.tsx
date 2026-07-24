import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const sizeMap = {
    sm: { width: 120, height: 24 },
    md: { width: 180, height: 32 },
    lg: { width: 240, height: 48 },
  };

  const s = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded cursor-pointer ${className}`}>
      <Image 
        src="/images/Official_logo.png" 
        alt="Sukabumi Eundeur" 
        width={s.width} 
        height={s.height} 
        className="object-contain"
        priority
      />
    </div>
  );
}

