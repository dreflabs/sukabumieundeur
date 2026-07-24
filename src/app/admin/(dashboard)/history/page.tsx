export const dynamic = 'force-dynamic';
import React from 'react';
import { query } from '@/lib/db';
import { requireAdminRole } from '@/lib/requireAdmin';
import { History } from 'lucide-react';
import { HistoryEvent } from '@/types/database';
import HistoryClient from './HistoryClient';

export default async function AdminHistoryPage() {
  await requireAdminRole(['SUPER_ADMIN', 'MODULE_ADMIN']);
  
  const events = await query<HistoryEvent>('SELECT * FROM history_events ORDER BY year DESC, created_at DESC');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
          <History className="w-5 h-5 text-red-500" />
          History Moderation
        </h1>
      </div>

      <HistoryClient initialEvents={events} />
    </div>
  );
}
