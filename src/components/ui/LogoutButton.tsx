'use client';
import React from 'react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-zinc-900 border border-zinc-800 hover:border-red-600 text-xs font-mono px-4 py-2 rounded-lg flex items-center gap-2 text-zinc-300 transition-all shadow-sm">
      <LogOut className="w-3.5 h-3.5 text-red-500" /> Logout
    </button>
  );
}
