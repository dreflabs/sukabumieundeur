export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User, Phone, UserPlus } from 'lucide-react';
import Image from 'next/image';
import BrandLogo from '@/components/ui/BrandLogo';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
  fullName: z.string().min(3, "Nama Lengkap minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter").regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor telepon tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Pendaftaran berhasil! Silakan masuk.');
        router.push('/login?registered=true');
      } else {
        toast.error(result.error || 'Gagal mendaftar.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex font-sans bg-black">
      {/* Left Column: Visual Area */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
        <Image 
          src="/images/auth-bg.jpg" 
          alt="Festival Crowd" 
          fill 
          priority
          className="object-cover transition-transform duration-[20s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-brand/10 mix-blend-overlay"></div>
        <div className="absolute bottom-12 left-12 max-w-md space-y-4 fade-in-up">
          <BrandLogo size="lg" />
          <p className="text-zinc-300 font-mono text-sm leading-relaxed pt-4">
            Akses portal eksklusif untuk member komunitas. Dapatkan notifikasi tiket presale, 
            merchandise edisi terbatas, dan akses ke ruang diskusi rahasia.
          </p>
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 lg:px-16 xl:px-24 relative overflow-y-auto">
        
        {/* Mobile Background (Hidden on desktop) */}
        <div className="absolute inset-0 z-0 lg:hidden opacity-20 fixed">
          <Image src="/images/auth-bg.jpg" alt="Festival Crowd" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/80"></div>
        </div>

        <div className="w-full max-w-md mx-auto relative z-10 space-y-8 my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden fade-in-up">
            <BrandLogo size="md" />
          </div>

          <div className="space-y-2 fade-in-up stagger-1">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight font-outfit">
              GABUNG <span className="text-brand">KOMUNITAS</span>
            </h2>
            <p className="text-sm text-zinc-400 font-mono">
              Isi data diri Anda untuk membuat akun member portal.
            </p>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 p-8 shadow-2xl rounded-sm space-y-6 fade-in-up stagger-2">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Nama Lengkap</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand transition-colors"><User className="w-4 h-4" /></div>
                    <input type="text" {...register('fullName')} placeholder="Metalhead" className={`w-full bg-zinc-950/50 border ${errors.fullName ? 'border-brand focus:border-brand' : 'border-zinc-800 focus:border-brand'} rounded-sm pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all`} />
                  </div>
                  {errors.fullName && <p className="text-brand text-[10px] font-mono mt-1">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand transition-colors"><User className="w-4 h-4" /></div>
                    <input type="text" {...register('username')} placeholder="metalhead_skbm" className={`w-full bg-zinc-950/50 border ${errors.username ? 'border-brand focus:border-brand' : 'border-zinc-800 focus:border-brand'} rounded-sm pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all`} />
                  </div>
                  {errors.username && <p className="text-brand text-[10px] font-mono mt-1">{errors.username.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand transition-colors"><Mail className="w-4 h-4" /></div>
                  <input type="email" {...register('email')} placeholder="metalhead@example.com" className={`w-full bg-zinc-950/50 border ${errors.email ? 'border-brand focus:border-brand' : 'border-zinc-800 focus:border-brand'} rounded-sm pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all`} />
                </div>
                {errors.email && <p className="text-brand text-[10px] font-mono mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">No. WhatsApp</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand transition-colors"><Phone className="w-4 h-4" /></div>
                  <input type="tel" {...register('phone')} placeholder="08123456789" className={`w-full bg-zinc-950/50 border ${errors.phone ? 'border-brand focus:border-brand' : 'border-zinc-800 focus:border-brand'} rounded-sm pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all`} />
                </div>
                {errors.phone && <p className="text-brand text-[10px] font-mono mt-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand transition-colors"><Lock className="w-4 h-4" /></div>
                  <input type="password" {...register('password')} placeholder="••••••••" className={`w-full bg-zinc-950/50 border ${errors.password ? 'border-brand focus:border-brand' : 'border-zinc-800 focus:border-brand'} rounded-sm pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all`} />
                </div>
                {errors.password && <p className="text-brand text-[10px] font-mono mt-1">{errors.password.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand hover:bg-brand/80 text-black font-bold uppercase tracking-widest py-3 rounded-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> Memproses...</span>
                ) : (
                  <>DAFTAR SEKARANG <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-zinc-800/80 text-center">
              <p className="text-xs text-zinc-500 font-mono">
                Sudah punya akses? <Link href="/login" className="text-brand font-bold hover:text-white transition-colors uppercase tracking-widest">Masuk Portal</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
