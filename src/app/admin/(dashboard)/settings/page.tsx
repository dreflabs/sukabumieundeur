import React from 'react';
import { query } from '@/lib/db';
import { requireAdminRole } from '@/lib/requireAdmin';
import { Settings as SettingsIcon } from 'lucide-react';
import { SiteSetting } from '@/types/database';
import SettingsClient from './SettingsClient';

export default async function AdminSettingsPage() {
  await requireAdminRole(['SUPER_ADMIN']);
  
  const settings = await query<SiteSetting>('SELECT * FROM site_settings ORDER BY key ASC');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-red-500" />
          Site Settings
        </h1>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  );
}
