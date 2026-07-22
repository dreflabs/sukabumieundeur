'use client';

import React, { useState } from 'react';
import { TicketCategory } from '@/types/database';
import { Minus, Plus, Ticket, ShieldAlert } from 'lucide-react';

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
      className={`bg-zinc-900/90 border ${
        category.name.includes('VIP') || category.name.includes('PRESALE')
          ? 'border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.25)]'
          : 'border-zinc-800'
      } rounded-lg p-6 flex flex-col justify-between relative transition-all hover:border-red-600/70`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-zinc-800 text-zinc-400">
            Maks {category.max_per_transaction} Tiket/Tx
          </span>
          <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded font-bold ${
            isSoldOut ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
          }`}>
            {isSoldOut ? 'Habis (Sold Out)' : `Sisa ${category.available_quota} Tiket`}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">{category.name}</h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{category.description}</p>
        </div>

        <div className="text-3xl font-black text-red-500 tracking-tight pt-2">
          {formatRupiah(category.price)}
          <span className="text-xs font-normal text-zinc-500 ml-1">/ tiket</span>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-zinc-800/80 space-y-4">
        {!isSoldOut && (
          <div className="flex items-center justify-between bg-zinc-950 px-3 py-2 rounded border border-zinc-800">
            <span className="text-xs font-mono text-zinc-400">Jumlah Tiket:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1 || isHolding}
                className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-sm font-bold text-white w-4 text-center">{quantity}</span>
              <button
                type="button"
                onClick={increment}
                disabled={quantity >= category.max_per_transaction || quantity >= category.available_quota || isHolding}
                className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white flex items-center justify-center transition-colors"
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
          className={`w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all ${
            isSoldOut
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          {isHolding ? 'Mengunci Tiket...' : isSoldOut ? 'Sold Out' : `Kunci ${quantity} Tiket (Hold 15-Min)`}
        </button>
      </div>
    </div>
  );
}
