export const dynamic = 'force-dynamic';
import React from 'react';
import { query } from '@/lib/db';
import { requireAdminRole } from '@/lib/requireAdmin';
import { Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '@/types/database';
import GalleryClient from './GalleryClient';

export default async function AdminGalleryPage() {
  await requireAdminRole(['SUPER_ADMIN', 'MODULE_ADMIN']);
  
  const items = await query<GalleryItem>('SELECT * FROM gallery_items ORDER BY created_at DESC');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-red-500" />
          Gallery Management
        </h1>
      </div>

      <GalleryClient initialItems={items} />
    </div>
  );
}
