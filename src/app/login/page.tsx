export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldCheck, LogIn } from 'lucide-react';
import Image from 'next/image';
import BrandLogo from '@/components/ui/BrandLogo';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
const loginSchema = z.object({
  emailOrUsername: z.string().min(3, "Email atau Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Login berhasil!');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Gagal login.');
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 lg:px-16 xl:px-24 relative">
        
        {/* Mobile Background (Hidden on desktop) */}
        <div className="absolute inset-0 z-0 lg:hidden opacity-20">
          <Image src="/images/auth-bg.jpg" alt="Festival Crowd" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/80"></div>
        </div>

        <div className="w-full max-w-md mx-auto relative z-10 space-y-10">
          {/* Mobile Logo */}
          <div className="lg:hidden fade-in-up">
            <BrandLogo size="md" />
          </div>

          <div className="space-y-2 fade-in-up stagger-1">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight font-outfit">
              MASUK <span className="text-brand">PORTAL</span>
            </h2>
            <p className="text-sm text-zinc-400 font-mono">
              Masukkan kredensial Anda untuk mengakses dashboard member.
            </p>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 p-8 shadow-2xl rounded-sm space-y-6 fade-in-up stagger-2">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">
                  Email / Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    {...register('emailOrUsername')}
                    placeholder="metalhead@example.com" 
                    className={`w-full bg-zinc-950/50 border ${errors.emailOrUsername ? 'border-brand focus:border-brand' : 'border-zinc-800 focus:border-brand'} rounded-sm pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all`}
                  />
                </div>
                {errors.emailOrUsername && <p className="text-brand text-[10px] font-mono mt-1">{errors.emailOrUsername.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">
                    Password
                  </label>
                  <span className="text-[10px] text-zinc-600 font-mono cursor-not-allowed">Lupa? (Soon)</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type="password" 
                    {...register('password')}
                    placeholder="••••••••" 
                    className={`w-full bg-zinc-950/50 border ${errors.password ? 'border-brand focus:border-brand' : 'border-zinc-800 focus:border-brand'} rounded-sm pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand transition-all`}
                  />
                </div>
                {errors.password && <p className="text-brand text-[10px] font-mono mt-1">{errors.password.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand hover:bg-brand/80 text-black font-bold uppercase tracking-widest py-3 rounded-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)]"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> Authenticating...</span>
                ) : (
                  <>MASUK <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-zinc-800/80 text-center">
              <p className="text-xs text-zinc-500 font-mono">
                Belum punya akses? <Link href="/register" className="text-brand font-bold hover:text-white transition-colors uppercase tracking-widest">Daftar Sekarang</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
