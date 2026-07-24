import React from 'react';
import { query } from '@/lib/db';
import { requireAdminRole } from '@/lib/requireAdmin';
import { Mail } from 'lucide-react';
import { ContactMessage } from '@/types/database';
import MessagesClient from './MessagesClient';

export default async function AdminMessagesPage() {
  await requireAdminRole(['SUPER_ADMIN', 'MODULE_ADMIN']);
  
  const messages = await query<ContactMessage>('SELECT * FROM contact_messages ORDER BY is_read ASC, created_at DESC');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
          <Mail className="w-5 h-5 text-red-500" />
          Inbox Messages
        </h1>
      </div>

      <MessagesClient initialMessages={messages} />
    </div>
  );
}
