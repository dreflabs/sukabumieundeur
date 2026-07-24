'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MerchProduct } from '@/types/database';
import { ArrowLeft, ShieldCheck, Truck, Package } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import CartDrawer from '@/components/store/CartDrawer';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MerchVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<MerchProduct | null>(null);
  const [variants, setVariants] = useState<MerchVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<MerchVariant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cart Store
  const addItem = useCartStore(state => state.addItem);
  const totalItems = useCartStore(state => state.totalItems());
  const openCart = useCartStore(state => state.openCart);
  
  const [viewers, setViewers] = useState<number>(0);

  useEffect(() => {
    // Random viewers between 12 and 45 to trigger FOMO
    setViewers(Math.floor(Math.random() * (45 - 12 + 1)) + 12);
    
    // Change viewers count randomly every 10 seconds to make it look live
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 5) - 2); 
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/v1/merchandise/products/${slug}`);
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
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // We treat size variant as part of the name to keep cart simple for now
    // In real app, we might want variant_id in the cart schema
    const variantName = selectedVariant ? `${product.title} (${selectedVariant.size})` : product.title;
    
    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id.toString(),
      productId: product.id.toString(),
      variantId: selectedVariant ? selectedVariant.id.toString() : undefined,
      name: variantName,
      price: Number(product.base_price),
      image: product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
      category: product.category
    });
    
    openCart(); // Automatically open cart after adding to mimic modern stores
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center font-inter text-xs tracking-widest uppercase">
        <p>Product Not Found.</p>
        <Link href="/store" className="mt-4 text-brand border-b border-brand">Back to Store</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col">
      <CartDrawer />
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/store" className="flex items-center gap-2 text-xs font-inter tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK TO STORE
        </Link>
        <div 
          onClick={openCart}
          className="flex items-center gap-2 cursor-pointer text-white hover:text-brand transition-colors"
        >
          <span className="font-inter font-bold text-xs tracking-widest uppercase">
            CART ({mounted ? totalItems : 0})
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </div>
      </header>

      {/* Main Detail Container */}
      <main className="py-12 px-6 lg:px-24 mx-auto w-full max-w-7xl flex-grow">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-[4/5] bg-[#111] overflow-hidden group">
              {product.images && product.images.length > 0 ? (
                <Image 
                  src={product.images[0]} 
                  alt={product.title} 
                  fill
                  className="object-cover mix-blend-luminosity opacity-90 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-700 font-inter text-xs tracking-widest uppercase">NO IMAGE</div>
              )}
              <div className="absolute top-4 left-4 bg-brand px-3 py-1">
                <span className="font-inter font-bold text-black text-[10px] tracking-widest uppercase">{product.category}</span>
              </div>
            </div>
            {/* Gallery Thumbnails (Static for now) */}
            <div className="grid grid-cols-4 gap-4">
               {[1, 2, 3].map((_, idx) => (
                 <div key={idx} className="aspect-square bg-[#111] opacity-50 hover:opacity-100 cursor-pointer transition-opacity border border-white/5 relative overflow-hidden">
                   {product.images && product.images.length > 0 && (
                      <Image src={product.images[0]} alt={product.title} fill className="object-cover grayscale" />
                   )}
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Right: Product Detail */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex flex-col justify-center"
          >
            <div className="space-y-6">
              
              <div>
                <h1 className="font-outfit font-black text-5xl md:text-6xl text-white uppercase tracking-tighter leading-none mb-4">
                  {product.title}
                </h1>
                <div className="text-3xl font-inter font-bold text-brand">
                  IDR {Number(product.base_price).toLocaleString('id-ID')}
                </div>
              </div>

              {/* Live Viewers Scarcity */}
              {viewers > 0 && (
                <div className="flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-red-500 bg-red-500/10 p-3 border border-red-500/20 w-fit">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute"></div>
                  <div className="w-2 h-2 rounded-full bg-red-500 relative"></div>
                  {viewers} people are viewing this right now
                </div>
              )}

              <div className="prose prose-invert prose-sm font-inter text-gray-400">
                <p>{product.description}</p>
              </div>

              {/* Variant Size Selector */}
              {variants.length > 0 ? (
                <div className="space-y-3 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">
                      SELECT SIZE
                    </label>
                    <span className="text-[10px] text-gray-500 underline cursor-pointer hover:text-white transition-colors">SIZE CHART</span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        disabled={v.stock <= 0}
                        className={`py-3 flex items-center justify-center font-inter font-bold text-xs transition-colors border ${
                          selectedVariant?.id === v.id
                            ? 'bg-brand border-brand text-black'
                            : v.stock <= 0
                            ? 'bg-transparent border-white/5 text-white/20 cursor-not-allowed relative overflow-hidden'
                            : 'bg-transparent border-white/20 text-white hover:border-brand hover:text-brand'
                        }`}
                      >
                        {v.size}
                        {v.stock <= 0 && (
                          <div className="absolute inset-0 w-full h-full border-t border-white/20 transform rotate-45 scale-150 origin-center" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Extreme FOMO Scarcity Alert */}
                  {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                    <div className="bg-red-600 text-white p-3 font-inter text-[10px] font-black uppercase tracking-widest mt-2 animate-pulse flex items-center gap-2 border border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                      <span className="text-sm">⚠️</span> HURRY! ONLY {selectedVariant.stock} LEFT IN STOCK. CHECKOUT NOW!
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-6 border-t border-white/10">
                  <div className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">ONE SIZE FITS ALL</div>
                </div>
              )}

              {/* CTA */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={selectedVariant ? selectedVariant.stock <= 0 : false}
                  className="w-full py-5 bg-brand hover:bg-white text-black font-inter font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedVariant && selectedVariant.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
              </div>

              {/* Delivery Benefits */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                <div className="flex flex-col gap-2">
                  <Package className="w-5 h-5 text-brand" />
                  <span className="font-inter text-xs text-white uppercase tracking-widest">PREMIUM MATERIALS</span>
                  <span className="font-inter text-[10px] text-gray-500">100% Heavyweight Cotton 24s.</span>
                </div>
                <div className="flex flex-col gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand" />
                  <span className="font-inter text-xs text-white uppercase tracking-widest">SECURE CHECKOUT</span>
                  <span className="font-inter text-[10px] text-gray-500">Encrypted payment via Midtrans.</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Cross Selling Section (You May Also Like) */}
        <div className="mt-24 pt-12 border-t border-white/10">
          <h2 className="font-outfit font-black text-3xl text-white uppercase tracking-tighter mb-8 text-center">
            YOU MAY ALSO LIKE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {/* Dummy Data for MVP cross-selling */}
             {[1, 2, 3, 4].map((item) => (
               <Link href="/store" key={item} className="group block">
                 <div className="relative aspect-[3/4] bg-[#111] overflow-hidden mb-4 border border-white/5">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                     <span className="font-inter font-bold text-[10px] text-brand tracking-widest uppercase border-b border-brand">View Product</span>
                   </div>
                   <Image 
                     src={`https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=400&auto=format&fit=crop&random=${item}`}
                     alt="Related Product" 
                     fill 
                     className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                   />
                 </div>
                 <h3 className="font-inter font-bold text-xs text-white uppercase tracking-widest truncate">Eundeur Classic Tee</h3>
                 <p className="font-inter text-[10px] text-gray-500 mt-1">IDR 150.000</p>
               </Link>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
}
