'use client';

import React, { useState, useTransition } from 'react';
import { Profile, UserRole } from '@/types/database';
import { Shield, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { updateUserRole, deleteUser } from './actions';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function UsersClient({ initialUsers }: { initialUsers: Profile[] }) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!confirm(`Ubah role pengguna menjadi ${newRole}?`)) return;
    
    setLoadingId(userId);
    startTransition(async () => {
      try {
        const res = await updateUserRole(userId, newRole);
        if (res.success) {
          setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
          toast.success("Role diperbarui");
        } else {
          toast.error(res.error || 'Gagal mengubah role');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      } finally {
        setLoadingId(null);
      }
    });
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`PERINGATAN: Hapus pengguna ${email}? Tindakan ini tidak dapat dibatalkan.`)) return;
    
    setLoadingId(userId);
    startTransition(async () => {
      try {
        const res = await deleteUser(userId);
        if (res.success) {
          setUsers(users.filter(u => u.id !== userId));
          toast.success("Pengguna dihapus");
        } else {
          toast.error(res.error || 'Gagal menghapus pengguna');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      } finally {
        setLoadingId(null);
      }
    });
  };

  if (users.length === 0) {
    return <EmptyState icon={Shield} title="Tidak Ada Pengguna" description="Belum ada data pengguna yang terdaftar." />;
  }

  return (
    <div className="bg-card border border-border overflow-hidden shadow-brutal">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-inter text-muted">
          <thead className="bg-background border-b border-border text-muted uppercase tracking-widest text-[10px]">
            <tr>
              <th className="px-4 py-3 font-bold">User</th>
              <th className="px-4 py-3 font-bold">Role</th>
              <th className="px-4 py-3 font-bold">Joined</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{user.full_name}</span>
                    <span className="text-xs text-muted font-mono">{user.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select 
                    disabled={isPending || loadingId === user.id}
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="bg-background border border-border text-xs px-2 py-1 text-white focus:border-brand outline-none disabled:opacity-50"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="MODULE_ADMIN">MODULE_ADMIN</option>
                    <option value="ORGANISER">ORGANISER</option>
                    <option value="ARTIST">ARTIST</option>
                    <option value="MEMBER">MEMBER</option>
                    <option value="GUEST">GUEST</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-xs font-mono">
                  {new Date(user.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button 
                    disabled={isPending || loadingId === user.id}
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user.id, user.email)}
                    className="w-8 h-8 text-muted hover:text-red-500 hover:bg-red-500/10"
                    title="Delete User"
                  >
                    {loadingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
