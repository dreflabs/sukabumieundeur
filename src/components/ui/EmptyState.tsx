import React from 'react';
import Link from 'next/link';
import { LucideIcon, Ghost } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ 
  icon: Icon = Ghost, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-20 px-6 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl backdrop-blur-sm border-dashed">
      <div className="w-20 h-20 bg-zinc-950/80 border border-zinc-800/60 rounded-full flex items-center justify-center mb-6 shadow-inner relative group">
        <div className="absolute inset-0 bg-red-600 blur-xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full"></div>
        <Icon className="w-8 h-8 text-zinc-500 relative z-10" />
      </div>
      
      <h3 className="text-xl font-black text-white uppercase tracking-tight font-outfit mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 font-mono max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      
      {actionLabel && actionHref && (
        <Link 
          href={actionHref}
          className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:-translate-y-0.5"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
