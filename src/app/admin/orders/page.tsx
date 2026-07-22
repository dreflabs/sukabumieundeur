'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, CheckCircle, Clock, Truck, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/orders');
      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">MANAJEMEN TRANSAKSI & PESANAN</h1>
          <p className="text-xs text-zinc-400 font-mono">Kelola Status Pembayaran, Penerbitan Tiket, & Input Resi Pengiriman Merchandise.</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900 transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-500">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Memuat daftar transaksi...</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase">
                <tr>
                  <th className="p-4">No. Transaksi</th>
                  <th className="p-4">Nama Pembeli</th>
                  <th className="p-4">Item Pesanan</th>
                  <th className="p-4">Total Tagihan</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{ord.order_number}</td>
                    <td className="p-4">{ord.user_name}</td>
                    <td className="p-4">{ord.item_summary}</td>
                    <td className="p-4 font-bold text-red-400">{formatRupiah(ord.total_amount)}</td>
                    <td className="p-4">{ord.payment_method}</td>
                    <td className="p-4">
                      <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => alert(`Detail transaksi ${ord.order_number}`)}
                        className="px-3 py-1 bg-zinc-800 hover:bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
