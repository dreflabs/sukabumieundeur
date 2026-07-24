import React from 'react';
import AdminOrdersClient from '@/components/admin/AdminOrdersClient';

import { query } from '@/lib/db';

import { requireAdminRole } from '@/lib/requireAdmin';

async function getOrders() {
  try {
    const auth = await requireAdminRole(['SUPER_ADMIN', 'ORGANISER']);
    if (!auth.success) return [];
    const orders = await query(`SELECT * FROM public.orders ORDER BY created_at DESC`);
    return orders;
  } catch (err) {
    console.error('Failed to fetch admin orders:', err);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
