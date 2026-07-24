export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Profile } from '@/types/database';
import Image from 'next/image';
import BrandLogo from '@/components/ui/BrandLogo';
import DashboardClient from '@/components/dashboard/DashboardClient';
import LogoutButton from '@/components/ui/LogoutButton';
import { getUserSessionOrNull } from '@/lib/auth';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';

async function getProfile(): Promise<Profile | null> {
  const session = await getUserSessionOrNull();
  if (!session || !session.id) return null;
  const profiles = await query<Profile>('SELECT * FROM profiles WHERE id = $1', [session.id]);
  return profiles.length > 0 ? profiles[0] : null;
}

export default async function DashboardPage() {
  const profile = await getProfile();
  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col font-sans relative overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image src="/images/dashboard-bg.jpg" alt="Dashboard Texture" fill className="object-cover mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/80 via-[#0a0a0c]/90 to-[#0a0a0c]"></div>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="scale-90 origin-left">
          <BrandLogo size="sm" />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-[10px] text-zinc-400 hover:text-white font-mono uppercase tracking-widest hidden md:block transition-colors">
            Public Web
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto w-full py-10 px-6 grid lg:grid-cols-4 gap-8 flex-grow relative z-10">
        <DashboardClient profile={profile} />
      </div>
    </div>
  );
}
