export const dynamic = 'force-dynamic';
import React from 'react';
import { query } from '@/lib/db';
import { requireAdminRole } from '@/lib/requireAdmin';
import { MessageSquare } from 'lucide-react';
import { ForumTopic } from '@/types/database';
import CommunityClient from './CommunityClient';

export default async function AdminCommunityPage() {
  await requireAdminRole(['SUPER_ADMIN', 'MODULE_ADMIN']);
  
  const topics = await query<ForumTopic & { author_name: string }>(`
    SELECT t.*, p.username as author_name 
    FROM forum_topics t
    LEFT JOIN profiles p ON t.author_id = p.id
    ORDER BY t.is_pinned DESC, t.created_at DESC
  `);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-red-500" />
          Community Moderation
        </h1>
      </div>

      <CommunityClient initialTopics={topics} />
    </div>
  );
}
