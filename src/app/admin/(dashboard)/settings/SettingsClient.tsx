'use client';

import React, { useState, useTransition } from 'react';
import { SiteSetting } from '@/types/database';
import { Settings as SettingsIcon, Save, Trash2, Plus, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { saveSetting, deleteSetting } from './actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function SettingsClient({ initialSettings }: { initialSettings: SiteSetting[] }) {
  const [settings, setSettings] = useState<SiteSetting[]>(initialSettings);
  const [isPending, startTransition] = useTransition();

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  
  const handleSave = async (key: string, value: string) => {
    if (!key.trim() || !value.trim()) return;
    
    setLoadingKey(key);
    startTransition(async () => {
      try {
        const res = await saveSetting(key, value);
        if (res.success) {
          // Optimistic update
          const existingIndex = settings.findIndex(s => s.key === key);
          if (existingIndex >= 0) {
            const updated = [...settings];
            updated[existingIndex].value = value;
            setSettings(updated);
            toast.success("Pengaturan diperbarui");
          } else {
            setSettings([...settings, { id: 'temp', key, value, created_at: '', updated_at: '' }]);
            toast.success("Pengaturan ditambahkan");
          }
          if (key === newKey) {
            setNewKey('');
            setNewValue('');
          }
        } else {
          toast.error(res.error || 'Gagal menyimpan');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      } finally {
        setLoadingKey(null);
      }
    });
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Hapus pengaturan ${key}?`)) return;
    
    setLoadingKey(key);
    startTransition(async () => {
      try {
        const res = await deleteSetting(key);
        if (res.success) {
          setSettings(settings.filter(s => s.key !== key));
          toast.success("Pengaturan dihapus");
        } else {
          toast.error(res.error || 'Gagal menghapus');
        }
      } catch (err) {
        toast.error('Terjadi kesalahan');
      } finally {
        setLoadingKey(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border p-4 rounded-lg flex items-end gap-4 shadow-brutal">
        <div className="flex-1">
          <label htmlFor="setting-key" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Kunci (Key)</label>
          <Input 
            id="setting-key"
            type="text" 
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Misal: social_instagram"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="setting-value" className="block text-xs font-inter tracking-widest uppercase text-muted mb-1">Nilai (Value)</label>
          <Input 
            id="setting-value"
            type="text" 
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="https://instagram.com/..."
          />
        </div>
        <Button 
          disabled={isPending || !newKey || !newValue}
          onClick={() => handleSave(newKey, newValue)}
          className="whitespace-nowrap flex items-center gap-2"
        >
          {loadingKey === newKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Tambah
        </Button>
      </div>

      {settings.length === 0 ? (
        <EmptyState icon={SettingsIcon} title="Belum Ada Pengaturan" description="Tambahkan pengaturan sistem pertama Anda di atas." />
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm text-muted font-inter">
            <thead className="bg-background border-b border-border text-muted uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-4 py-3 font-bold">Key</th>
                <th className="px-4 py-3 font-bold">Value</th>
                <th className="px-4 py-3 font-bold text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {settings.map((setting) => (
                <tr key={setting.key} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white font-mono">{setting.key}</td>
                  <td className="px-4 py-3">
                    <Input 
                      type="text"
                      defaultValue={setting.value}
                      onBlur={(e) => {
                        if (e.target.value !== setting.value) {
                          handleSave(setting.key, e.target.value);
                        }
                      }}
                      className="bg-transparent border-transparent hover:border-border h-9 text-white"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      disabled={isPending || loadingKey === setting.key}
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(setting.key)}
                      className="w-8 h-8 text-muted hover:text-red-500 hover:bg-red-500/10"
                    >
                      {loadingKey === setting.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
