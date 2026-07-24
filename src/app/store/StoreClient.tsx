"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import CartDrawer from "@/components/store/CartDrawer";

type Product = {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  category: string;
  image: string;
  status: string;
};

export default function StoreClient({ products, activeCategory }: { products: Product[], activeCategory: string }) {
  const router = useRouter();
  
  // Cart Store
  const addItem = useCartStore((state) => state.addItem);
  const totalItems = useCartStore((state) => state.totalItems());
  const openCart = useCartStore((state) => state.openCart);
  
  // Hydration fix for Zustand persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'ALL') {
      router.push('/store');
    } else {
      router.push(`/store?category=${cat}`);
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.status === 'SOLD OUT') return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <div className="w-full bg-[#050505] min-h-screen flex flex-col">
      <CartDrawer />
      
      {/* Page Hero */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col justify-end pb-16 pt-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2940&auto=format&fit=crop"
            alt="Store Background"
            fill
            className="object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24 flex justify-between items-end">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-inter font-bold text-brand text-[11px] tracking-[0.2em] uppercase mb-4"
            >
              Official Merchandise
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white leading-none"
            >
              STORE
            </motion.h1>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={openCart}
            className="hidden md:flex items-center gap-2 cursor-pointer text-white hover:text-brand transition-colors"
          >
            <span className="font-inter font-bold text-xs tracking-widest uppercase">
              CART ({mounted ? totalItems : 0})
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 container mx-auto px-6 md:px-12 lg:px-24 py-24">
        {/* Categories / Filter */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-16">
          <div className="flex flex-wrap items-center gap-4">
            {['ALL', 'APPAREL', 'OUTERWEAR', 'ACCESSORIES', 'TICKETS'].map((filter, i) => (
              <button 
                key={filter}
                onClick={() => handleCategoryClick(filter)}
                className={`font-inter font-bold text-[10px] tracking-widest uppercase px-4 py-2 transition-colors ${
                  activeCategory === filter ? 'bg-brand text-black' : 'border border-white/20 text-white hover:border-brand hover:text-brand'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-gray-400 font-inter text-xs tracking-widest uppercase cursor-pointer hover:text-white transition-colors">
            <span>SORT BY: LATEST</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="group flex flex-col cursor-pointer"
              onClick={() => router.push(`/store/${product.id}`)}
            >
              <div className="relative w-full aspect-square overflow-hidden bg-[#111] mb-6">
                {product.image && (
                  <Image 
                    src={product.image}
                    alt={product.name}
                    fill
                    className={`object-cover transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal ${product.status === 'SOLD OUT' ? 'opacity-30' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`}
                  />
                )}
                {product.status && (
                  <div className={`absolute top-4 left-4 px-3 py-1 z-10 ${product.status === 'SOLD OUT' ? 'bg-red-500 text-white' : product.status === 'LOW STOCK' ? 'bg-orange-500 text-black' : 'bg-white text-black'}`}>
                    <span className="font-inter font-bold text-[10px] tracking-widest uppercase">{product.status}</span>
                  </div>
                )}
                {/* Add to Cart Overlay */}
                {product.status !== 'SOLD OUT' && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="px-6 py-3 border border-brand text-brand font-inter font-bold text-xs uppercase tracking-widest hover:bg-brand hover:text-black transition-colors"
                    >
                      QUICK ADD +
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-outfit font-black text-xl text-white uppercase group-hover:text-brand transition-colors leading-tight pr-4">
                    {product.name}
                  </h3>
                  <span className="font-inter font-bold text-gray-300 text-sm whitespace-nowrap">
                    {product.formattedPrice}
                  </span>
                </div>
                <p className="font-inter text-gray-500 text-[10px] tracking-[0.2em] uppercase">
                  {product.category}
                </p>
              </div>
            </motion.div>
          ))}
          
          {products.length === 0 && (
             <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center font-inter text-gray-500">
               No products found in this category.
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
