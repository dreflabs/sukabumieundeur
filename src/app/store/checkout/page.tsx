export const dynamic = 'force-dynamic';
"use client";

import { useCartStore } from "@/store/useCartStore";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

import Script from 'next/script';

declare global {
  interface Window {
    snap: any;
  }
}

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[0-9+]+$/, "Only numbers and + are allowed"),
  address: z.string().min(10, "Address is too short"),
  city: z.string().min(3, "City is required"),
  postalCode: z.string().min(4, "Invalid postal code"),
  courier: z.enum(['JNE', 'GOSEND'])
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      courier: 'JNE'
    }
  });

  const selectedCourier = watch('courier');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Protect route if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-inter text-xs tracking-widest uppercase text-white">
        <p className="mb-4">Your cart is empty.</p>
        <Button variant="link" onClick={() => router.push('/store')}>Back to Store</Button>
      </div>
    );
  }

  const shippingCost = selectedCourier === 'GOSEND' ? 25000 : 15000;
  const finalTotal = totalPrice() + shippingCost;

  const onSubmitPayment = async (data: CheckoutFormValues) => {
    setLoading(true);

    try {
      const res = await fetch('/api/v1/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          customer: data,
          shippingCost,
          totalAmount: finalTotal
        })
      });

      const resData = await res.json();

      if (res.ok && resData.token) {
        window.snap.pay(resData.token, {
          onSuccess: function(result: any) {
            clearCart();
            toast.success("Payment success!");
            router.push('/store');
          },
          onPending: function(result: any) {
            clearCart();
            toast.success("Waiting for payment!");
            router.push('/store');
          },
          onError: function(result: any) {
            toast.error("Payment failed!");
          },
          onClose: function() {
            toast.error('You closed the popup without finishing the payment');
          }
        });
      } else {
        toast.error("Failed to create transaction: " + (resData.message || "Unknown error"));
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DUMMYKEY123'}
        strategy="beforeInteractive"
      />
      
      {/* Simple Header */}
      <header className="border-b border-surface-3 px-6 py-6 flex items-center justify-between">
        <Link href="/store" className="flex items-center gap-2 text-xs font-inter tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK TO STORE
        </Link>
        <h1 className="font-outfit font-black text-xl uppercase tracking-tighter text-white hidden md:block">
          SECURE CHECKOUT
        </h1>
        <div className="flex items-center gap-2 text-xs font-inter text-brand tracking-widest uppercase">
          <ShieldCheck className="w-4 h-4" /> Encrypted
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-12">
        <form onSubmit={handleSubmit(onSubmitPayment)} className="grid lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left: Shipping Form */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Contact Info */}
            <section className="space-y-6">
              <h2 className="font-outfit font-black text-2xl uppercase tracking-tighter text-white flex items-center gap-3">
                <span className="w-6 h-6 bg-brand text-black rounded-full flex items-center justify-center text-xs">1</span> 
                Contact Info
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">First Name</label>
                  <Input {...register("firstName")} type="text" className={errors.firstName ? "border-red-500 focus:border-red-500" : ""} />
                  {errors.firstName && <p className="text-red-500 text-[10px] font-inter mt-1">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">Last Name</label>
                  <Input {...register("lastName")} type="text" className={errors.lastName ? "border-red-500 focus:border-red-500" : ""} />
                  {errors.lastName && <p className="text-red-500 text-[10px] font-inter mt-1">{errors.lastName.message}</p>}
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">Email Address</label>
                  <Input {...register("email")} type="email" className={errors.email ? "border-red-500 focus:border-red-500" : ""} />
                  {errors.email && <p className="text-red-500 text-[10px] font-inter mt-1">{errors.email.message}</p>}
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">Phone Number (WhatsApp)</label>
                  <Input {...register("phone")} type="tel" className={errors.phone ? "border-red-500 focus:border-red-500" : ""} />
                  {errors.phone && <p className="text-red-500 text-[10px] font-inter mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="space-y-6">
              <h2 className="font-outfit font-black text-2xl uppercase tracking-tighter text-white flex items-center gap-3">
                <span className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs">2</span> 
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">Full Address</label>
                  <Textarea {...register("address")} rows={3} className={errors.address ? "border-red-500 focus:border-red-500" : ""} />
                  {errors.address && <p className="text-red-500 text-[10px] font-inter mt-1">{errors.address.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">City</label>
                  <Input {...register("city")} type="text" className={errors.city ? "border-red-500 focus:border-red-500" : ""} />
                  {errors.city && <p className="text-red-500 text-[10px] font-inter mt-1">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-inter text-gray-500 uppercase tracking-widest">Postal Code</label>
                  <Input {...register("postalCode")} type="text" className={errors.postalCode ? "border-red-500 focus:border-red-500" : ""} />
                  {errors.postalCode && <p className="text-red-500 text-[10px] font-inter mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>
            </section>

            {/* Courier Selection */}
            <section className="space-y-6">
              <h2 className="font-outfit font-black text-2xl uppercase tracking-tighter text-white flex items-center gap-3">
                <span className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs">3</span> 
                Shipping Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border p-4 flex flex-col gap-2 cursor-pointer transition-colors ${selectedCourier === 'JNE' ? 'border-brand bg-brand/5' : 'border-surface-3 bg-surface-2 hover:border-surface-3/80'}`}>
                  <div className="flex justify-between items-center">
                    <input type="radio" {...register("courier")} value="JNE" className="sr-only" />
                    <span className="font-outfit font-black uppercase text-lg">JNE Reguler</span>
                    <Truck className={`w-5 h-5 ${selectedCourier === 'JNE' ? 'text-brand' : 'text-gray-500'}`} />
                  </div>
                  <span className="font-inter text-xs text-gray-400">2-3 Business Days</span>
                  <span className="font-inter font-bold text-white text-sm">IDR 15.000</span>
                </label>
                
                <label className={`border p-4 flex flex-col gap-2 cursor-pointer transition-colors ${selectedCourier === 'GOSEND' ? 'border-brand bg-brand/5' : 'border-surface-3 bg-surface-2 hover:border-surface-3/80'}`}>
                  <div className="flex justify-between items-center">
                    <input type="radio" {...register("courier")} value="GOSEND" className="sr-only" />
                    <span className="font-outfit font-black uppercase text-lg">GoSend</span>
                    <Truck className={`w-5 h-5 ${selectedCourier === 'GOSEND' ? 'text-brand' : 'text-gray-500'}`} />
                  </div>
                  <span className="font-inter text-xs text-gray-400">Same Day Delivery</span>
                  <span className="font-inter font-bold text-white text-sm">IDR 25.000</span>
                </label>
              </div>
            </section>

          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-surface-1 border border-surface-3 p-6 md:p-8 space-y-8">
              <h2 className="font-outfit font-black text-2xl uppercase tracking-tighter text-white">Order Summary</h2>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-16 h-16 bg-black shrink-0 overflow-hidden border border-surface-3">
                      <Image src={item.image} alt={item.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div className="absolute -top-2 -right-2 bg-brand text-black w-5 h-5 rounded-full flex items-center justify-center font-inter font-bold text-[10px] z-10">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-inter font-bold text-white uppercase text-xs leading-tight mb-1">{item.name}</h3>
                      <p className="font-inter text-gray-400 text-xs">IDR {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-surface-3 font-inter text-sm uppercase tracking-widest">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">IDR {totalPrice().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">IDR {shippingCost.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-surface-3">
                  <span>Total</span>
                  <span className="text-brand">IDR {finalTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-6 py-6" size="lg">
                {loading ? "PROCESSING..." : "PAY NOW (Midtrans)"}
              </Button>
              
              <p className="text-center text-[10px] font-inter text-gray-600 uppercase tracking-widest">
                Dengan melanjutkan pembayaran, Anda menyetujui Syarat & Ketentuan yang berlaku.
              </p>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}
