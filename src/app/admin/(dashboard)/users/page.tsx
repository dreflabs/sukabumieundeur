export const dynamic = 'force-dynamic';
import React from 'react';
import { query } from '@/lib/db';
import { requireAdminRole } from '@/lib/requireAdmin';
import { Shield, Trash2, ShieldAlert } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Profile } from '@/types/database';
import UsersClient from './UsersClient';

export default async function AdminUsersPage() {
  await requireAdminRole(['SUPER_ADMIN']);
  
  const users = await query<Profile>('SELECT id, email, username, full_name, role, created_at FROM profiles ORDER BY created_at DESC');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          User Management
        </h1>
      </div>

      <UsersClient initialUsers={users} />
    </div>
  );
}
