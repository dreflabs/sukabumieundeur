'use client';

import React, { useState, useEffect } from 'react';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { 
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); 
        return; 
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    
    calc(); 
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  
  return timeLeft;
}

export default function FestivalCountdown({ targetDate }: { targetDate: Date }) {
  const countdown = useCountdown(targetDate);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-5xl md:text-7xl font-mono font-black text-white tracking-tighter flex justify-center gap-2 drop-shadow-2xl">
        <span>{pad(countdown.days)}</span><span className="text-red-600/50">:</span>
        <span>{pad(countdown.hours)}</span><span className="text-red-600/50">:</span>
        <span>{pad(countdown.minutes)}</span><span className="text-red-600/50">:</span>
        <span className="text-red-500">{pad(countdown.seconds)}</span>
      </div>
      <div className="flex justify-center gap-8 md:gap-14 text-[10px] md:text-xs text-zinc-400 font-mono uppercase tracking-[0.3em]">
        <span>Days</span><span>Hrs</span><span>Mins</span><span>Secs</span>
      </div>
    </div>
  );
}
