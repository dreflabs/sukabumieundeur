'use client';

import React, { useState } from 'react';
import { MerchProduct } from '@/types/database';
import ProductCard from '@/components/store/ProductCard';
import { Search, ShoppingCart, PackageOpen } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCartStore } from '@/store/useCartStore';

interface StoreClientProps {
  initialProducts: MerchProduct[];
}

export default function StoreClient({ initialProducts }: StoreClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const totalItems = useCartStore(state => state.totalItems());
  const openCart = useCartStore(state => state.openCart);

  const filteredProducts = initialProducts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-1/60 p-4 border border-surface-3 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'APPAREL', 'OUTERWEAR', 'ACCESSORIES'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-inter font-bold uppercase transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand text-black'
                  : 'bg-surface-3 text-gray-400 hover:bg-surface-2'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-surface-3 text-white text-sm pl-9 pr-4 py-2 focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 font-inter mb-6 uppercase tracking-widest">
        <span>Menampilkan {filteredProducts.length} produk</span>
        <button onClick={openCart} className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
          <ShoppingCart className="w-4 h-4" /> {totalItems} Items
        </button>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState 
          icon={PackageOpen}
          title="Produk Tidak Ditemukan"
          description={`Tidak ada produk yang cocok dengan pencarian "${searchQuery}" di kategori ${selectedCategory}.`}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
