'use client';

import React, { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { MerchProduct } from '@/types/database';
import { ShoppingBag, ArrowLeft, ShieldCheck, Check, Truck, Package } from 'lucide-react';

interface MerchVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<MerchProduct | null>(null);
  const [variants, setVariants] = useState<MerchVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<MerchVariant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/v1/merchandise/products/${resolvedParams.slug}`);
        const result = await res.json();
        if (result.success) {
          setProduct(result.data.product);
          setVariants(result.data.variants);
          if (result.data.variants.length > 0) {
            setSelectedVariant(result.data.variants[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [resolvedParams.slug]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center font-mono text-xs">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 text-center font-mono text-xs">
        <p>Produk tidak ditemukan.</p>
        <Link href="/store" className="mt-4 text-red-500 underline">Kembali ke Store</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/store" className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Store
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-red-500">
          <ShieldCheck className="w-4 h-4" /> Official Merchandise Guaranteed
        </div>
      </header>

      {/* Main Detail Container */}
      <main className="py-12 px-6 max-w-5xl mx-auto w-full flex-grow">
        <div className="grid md:grid-cols-2 gap-10 bg-zinc-900 border border-zinc-800 rounded-lg p-6 md:p-8">
          {/* Left: Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-zinc-700 font-mono text-xs">[PRODUCT IMAGE]</div>
              )}
            </div>
          </div>

          {/* Right: Product Detail & Variant Selector */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest px-2.5 py-1 rounded bg-red-950/60 border border-red-800 inline-block">
                {product.category}
              </span>

              <h1 className="text-3xl font-black text-white uppercase tracking-tight">{product.title}</h1>

              <div className="text-3xl font-black text-red-500 font-mono">
                {formatRupiah(product.base_price)}
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-4">
                {product.description}
              </p>

              {/* Variant Size Selector */}
              {variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
                    Pilih Ukuran (Size Variant):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded text-xs font-mono font-bold uppercase border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {v.size} ({v.stock > 0 ? `Stok ${v.stock}` : 'Habis'})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA & Delivery Benefits */}
            <div className="space-y-4 border-t border-zinc-800 pt-6">
              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded border border-zinc-800">
                  <Package className="w-4 h-4 text-red-500" /> Plastisol High Duty
                </div>
                <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded border border-zinc-800">
                  <Truck className="w-4 h-4 text-red-500" /> Pengiriman Seluruh Indo
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Menambahkan "${product.title}" (${selectedVariant?.size}) ke keranjang belanja!`)}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Beli Sekarang (Varian {selectedVariant?.size})
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
