"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCartStore();
  const router = useRouter();
  
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = () => {
    closeCart();
    router.push('/store/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#050505] border-l border-white/10 z-[101] transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-outfit font-black text-2xl uppercase tracking-tighter text-white">YOUR CART</h2>
          <button onClick={closeCart} aria-label="Tutup Keranjang" className="text-gray-400 hover:text-brand transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 font-inter text-sm uppercase tracking-widest text-center space-y-4">
              <span className="text-4xl block mb-2">🛒</span>
              Your cart is empty.
              <br />
              Grab some sick merch.
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 border border-white/10 bg-[#111] p-3 group hover:border-white/30 transition-colors">
                <div className="relative w-24 h-24 bg-black shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-outfit font-black text-white uppercase text-sm leading-tight pr-6">{item.name}</h3>
                    <p className="font-inter text-brand font-bold text-xs mt-1">IDR {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-white/20">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Kurangi jumlah ${item.name}`} className="px-2 py-1 text-gray-400 hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="font-inter text-xs text-white px-2 font-bold" aria-live="polite">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Tambah jumlah ${item.name}`} className="px-2 py-1 text-gray-400 hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} aria-label={`Hapus ${item.name} dari keranjang`} className="text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-6 font-inter font-bold uppercase tracking-widest">
              <span className="text-gray-400 text-sm">SUBTOTAL</span>
              <span className="text-white text-lg">IDR {totalPrice().toLocaleString('id-ID')}</span>
            </div>
            <button 
              onClick={() => handleCheckout()}
              className="w-full bg-brand text-black font-inter font-black text-sm uppercase tracking-widest py-4 hover:bg-white transition-colors shadow-[0_0_20px_var(--color-brand)]"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
}
