'use client';

import React from 'react';
import Link from 'next/link';
import { MerchProduct } from '@/types/database';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: MerchProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600/70 transition-all flex flex-col justify-between">
      <div>
        <div className="aspect-square bg-zinc-950 relative overflow-hidden flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-zinc-700 font-mono text-xs">[NO IMAGE]</div>
          )}
          <div className="absolute top-3 left-3 bg-zinc-950/80 border border-zinc-800 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-red-400 uppercase tracking-widest">
            {product.category}
          </div>
        </div>

        <div className="p-5 space-y-2">
          <h3 className="text-base font-bold text-white uppercase line-clamp-1 group-hover:text-red-500 transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2">{product.description}</p>
          <div className="text-lg font-black text-red-500 font-mono pt-1">
            {formatRupiah(product.base_price)}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          href={`/store/${product.slug}`}
          className="w-full py-2.5 bg-zinc-800 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Detail & Beli
        </Link>
      </div>
    </div>
  );
}
