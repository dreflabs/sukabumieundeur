'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="bg-black border border-surface-3 overflow-hidden group hover:border-brand/70 transition-all flex flex-col justify-between">
      <div>
        <div className="aspect-square bg-surface-1 relative overflow-hidden flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="text-gray-600 font-inter text-xs">[NO IMAGE]</div>
          )}
          <div className="absolute top-3 left-3 bg-black/80 border border-surface-3 backdrop-blur-sm px-2.5 py-1 text-[10px] font-inter text-brand uppercase tracking-widest">
            {product.category}
          </div>
        </div>

        <div className="p-5 space-y-2">
          <h3 className="text-base font-bold text-white uppercase line-clamp-1 group-hover:text-brand transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>
          <div className="text-lg font-black text-brand font-inter pt-1">
            {formatRupiah(product.base_price)}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          href={`/store/${product.slug}`}
          className="w-full py-2.5 bg-surface-3 hover:bg-brand hover:text-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Detail & Beli
        </Link>
      </div>
    </div>
  );
}
