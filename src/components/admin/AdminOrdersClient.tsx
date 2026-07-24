'use client';

import React, { useState } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface AdminOrdersClientProps {
  initialOrders: any[];
}

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/orders');
      const result = await res.json();
      if (result.success) {
        setOrders(result.data);
        toast.success("Data pesanan diperbarui");
      } else {
        toast.error("Gagal memuat data pesanan");
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
      toast.error('Gagal mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-outfit font-black text-3xl uppercase tracking-tight text-white">MANAJEMEN TRANSAKSI & PESANAN</h1>
          <p className="text-xs text-muted font-inter tracking-widest uppercase">Kelola Status Pembayaran, Penerbitan Tiket, & Input Resi Pengiriman Merchandise.</p>
        </div>
        <Button
          onClick={() => fetchOrders()}
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} /> REFRESH DATA
        </Button>
      </div>

      <div className="bg-card border border-border shadow-brutal overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter text-muted">
            <thead className="bg-background border-b border-border text-muted uppercase tracking-widest text-[10px]">
              <tr>
                <th className="p-4 font-bold">No. Transaksi</th>
                <th className="p-4 font-bold">Nama Pembeli</th>
                <th className="p-4 font-bold">Item Pesanan</th>
                <th className="p-4 font-bold">Total Tagihan</th>
                <th className="p-4 font-bold">Payment Method</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">{ord.order_number}</td>
                  <td className="p-4 text-white">{ord.user_name}</td>
                  <td className="p-4">{ord.item_summary}</td>
                  <td className="p-4 font-bold text-brand font-mono">{formatRupiah(ord.total_amount)}</td>
                  <td className="p-4">{ord.payment_method}</td>
                  <td className="p-4">
                    <span className="bg-brand/10 border border-brand/30 text-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      onClick={() => toast(`Detail transaksi ${ord.order_number} belum tersedia`, { icon: 'ℹ️' })}
                      size="sm"
                    >
                      DETAIL
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
