'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User, Phone, ArrowLeft, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, fullName, phone, password })
      });

      const result = await res.json();

      if (result.success) {
        router.push('/login?registered=true');
      } else {
        setError(result.error || 'Gagal mendaftar.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col justify-center py-12 px-6 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Festival Portal
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-md flex items-center justify-center font-black text-xl text-black shadow-[0_0_15px_rgba(220,38,38,0.6)]">
            SE
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">DAFTAR MEMBER BARU</h2>
            <p className="text-xs text-zinc-400 font-mono">Sukabumi Eundeur Community Portal</p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 py-8 px-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-lg space-y-6">
          {error && (
            <div className="p-3 rounded bg-red-950/80 border border-red-800 text-red-400 text-xs font-mono">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500"><User className="w-4 h-4" /></div>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Metalhead Sukabumi" className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded pl-10 pr-3 py-2 text-sm text-white focus:outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500"><User className="w-4 h-4" /></div>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="metalhead_skbm" className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded pl-10 pr-3 py-2 text-sm text-white focus:outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500"><Mail className="w-4 h-4" /></div>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="metalhead@eundeur.com" className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded pl-10 pr-3 py-2 text-sm text-white focus:outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">No. WhatsApp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500"><Phone className="w-4 h-4" /></div>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="081234567890" className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded pl-10 pr-3 py-2 text-sm text-white focus:outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500"><Lock className="w-4 h-4" /></div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded pl-10 pr-3 py-2 text-sm text-white focus:outline-none transition-colors" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Memproses...' : 'Buat Akun Member'}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="text-red-500 hover:text-red-400 font-bold uppercase tracking-wider">
              Masuk Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
