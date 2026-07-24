'use client';

import React, { useState } from 'react';
import { TicketCategory } from '@/types/database';
import { Minus, Plus, Ticket, ShieldAlert, Sparkles } from 'lucide-react';

interface TicketCategoryCardProps {
  category: TicketCategory;
  onHoldTicket: (category: TicketCategory, quantity: number) => void;
  isHolding: boolean;
}

export default function TicketCategoryCard({
  category,
  onHoldTicket,
  isHolding
}: TicketCategoryCardProps) {
  const [quantity, setQuantity] = useState<number>(1);

  const increment = () => {
    if (quantity < category.max_per_transaction && quantity < category.available_quota) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isSoldOut = category.available_quota <= 0;

  return (
    <div
      className={`bg-surface-1 border-2 ${
        category.name.includes('VIP') || category.name.includes('PRESALE') || category.name.includes('ACCESS')
          ? 'border-brand shadow-brutal'
          : 'border-white/10'
      } rounded-none p-7 flex flex-col justify-between relative shadow-brutal-hover hover:border-brand overflow-hidden group`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-inter uppercase tracking-widest px-2.5 py-1 bg-surface-2 text-gray-400 border border-white/10">
            Maks {category.max_per_transaction} Tiket/Tx
          </span>
          <span className={`text-xs font-inter uppercase tracking-widest px-2.5 py-1 font-bold flex items-center gap-1.5 ${
            isSoldOut ? 'bg-surface-2 text-gray-500 border border-white/10' : 'bg-brand/10 text-brand border-brand/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-none ${isSoldOut ? 'bg-gray-500' : 'bg-brand animate-ping'}`}></span>
            {isSoldOut ? 'Habis (Sold Out)' : `Sisa ${category.available_quota} Tiket`}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-outfit font-black text-white uppercase tracking-tight">{category.name}</h3>
          <p className="text-xs font-inter text-gray-400 mt-1 line-clamp-2 leading-relaxed">{category.description}</p>
        </div>

        <div className="text-3xl font-outfit font-black text-brand tracking-tight pt-2">
          {formatRupiah(category.price)}
          <span className="text-xs font-inter text-gray-500 ml-1 uppercase tracking-widest">/ tiket</span>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-white/10 space-y-4">
        {!isSoldOut && (
          <div className="flex items-center justify-between bg-surface-3 px-4 py-2.5 border border-white/5">
            <span className="text-xs font-inter uppercase tracking-widest text-gray-400">Jumlah:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1 || isHolding}
                className="w-7 h-7 bg-surface-2 hover:bg-white/10 disabled:opacity-30 text-white flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-outfit text-sm font-black text-white w-4 text-center">{quantity}</span>
              <button
                type="button"
                onClick={increment}
                disabled={quantity >= category.max_per_transaction || quantity >= category.available_quota || isHolding}
                className="w-7 h-7 bg-surface-2 hover:bg-white/10 disabled:opacity-30 text-white flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onHoldTicket(category, quantity)}
          disabled={isSoldOut || isHolding}
          className={`w-full py-4 text-xs font-inter font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${
            isSoldOut
              ? 'bg-surface-2 text-gray-600 border-surface-2 cursor-not-allowed'
              : 'bg-brand hover:bg-white text-black border-brand shadow-[4px_4px_0_#ccff00] hover:shadow-[4px_4px_0_white]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          {isHolding ? 'MENGUNCI TIKET...' : isSoldOut ? 'SOLD OUT' : `KUNCI ${quantity} TIKET (HOLD 15-MIN)`}
        </button>
      </div>
    </div>
  );
}
