import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-zinc-800/60 rounded-md ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 space-y-4">
      <Skeleton className="w-full aspect-[4/3] rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-5/6 h-3" />
      </div>
      <Skeleton className="w-full h-10 mt-4 rounded-lg" />
    </div>
  );
}

export function SkeletonTicket() {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6 flex flex-col md:flex-row gap-6">
      <div className="space-y-4 flex-grow">
        <Skeleton className="w-24 h-5 rounded-full" />
        <Skeleton className="w-2/3 h-8" />
        <div className="space-y-2">
          <Skeleton className="w-1/2 h-3" />
          <Skeleton className="w-1/3 h-3" />
        </div>
      </div>
      <div className="w-full md:w-40 flex-shrink-0 flex flex-col justify-between">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-10 mt-4" />
      </div>
    </div>
  );
}

export function SkeletonNews() {
  return (
    <div className="group cursor-pointer">
      <Skeleton className="w-full aspect-[16/9] rounded-xl mb-4" />
      <div className="space-y-3">
        <Skeleton className="w-1/4 h-4" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-5/6 h-6" />
        <Skeleton className="w-2/3 h-3" />
      </div>
    </div>
  );
}

export function SkeletonTopic() {
  return (
    <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800/60 last:border-0">
      <div className="flex items-start gap-4 flex-grow w-full">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="space-y-2 w-full">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-3/4 md:w-1/2 h-5" />
          <Skeleton className="w-1/3 h-3" />
        </div>
      </div>
      <Skeleton className="w-24 h-8 rounded-lg flex-shrink-0" />
    </div>
  );
}
