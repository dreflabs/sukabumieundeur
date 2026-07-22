'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MerchProduct } from '@/types/database';
import ProductCard from '@/components/store/ProductCard';
import { ShoppingBag, Search, Flame, ArrowLeft, RefreshCw } from 'lucide-react';

export default function StorePage() {
  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/v1/merchandise/products';
      if (selectedCategory !== 'ALL') {
        url += `?category=${selectedCategory}`;
      }
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch merchandise:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Home
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-red-500">
          <ShoppingBag className="w-4 h-4" /> Official E-Commerce Store
        </div>
      </header>

      {/* Hero Store Banner */}
      <section className="py-12 px-6 border-b border-zinc-800 bg-zinc-950/60">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/40 text-red-400 text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 text-red-500" /> Official Underground Apparel
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
            SUKABUMI EUNDEUR <span className="text-red-500">STORE</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xl">
            Official Heavy Apparel, T-Shirt, Zip Hoodie, & Accessories Edisi Resmi Festival 2026.
          </p>
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="py-12 px-6 max-w-6xl mx-auto w-full flex-grow space-y-8">
        {/* Filters & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'T-Shirt', 'Hoodie', 'Accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold uppercase transition-colors ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk merchandise..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-500">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Memuat katalog produk merchandise...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-xs font-mono text-zinc-500 bg-zinc-900/40 rounded border border-zinc-800">
            Tidak ada produk merchandise yang ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
