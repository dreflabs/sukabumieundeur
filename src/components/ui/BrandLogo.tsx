import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const sizeMap = {
    sm: 'h-[24px]',
    md: 'h-[32px]',
    lg: 'h-[48px]',
  };

  const heightClass = sizeMap[size];

  return (
    <div className={`flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded cursor-pointer ${className}`}>
      <img 
        src="/images/Official_logo.png" 
        alt="Sukabumi Eundeur" 
        className={`${heightClass} w-auto object-contain`}
      />
    </div>
  );
}
