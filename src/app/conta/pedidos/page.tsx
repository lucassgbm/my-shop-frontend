'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api';

const statusColors: Record<string,string> = {
  pending:'bg-yellow-600/20 text-yellow-400', paid:'bg-green-600/20 text-green-400',
  shipped:'bg-blue-600/20 text-blue-400', delivered:'bg-green-600/20 text-green-400',
  cancelled:'bg-red-600/20 text-red-400',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { ordersApi.list().then((r) => setOrders(r.data.data)); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="section-title text-white mb-8">Meus Pedidos</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <p className="text-lg mb-4">Nenhum pedido ainda</p>
          <Link href="/produtos" className="btn-primary">Comprar agora</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/conta/pedidos/${o.id}`} className="card p-5 flex items-center justify-between hover:border-zinc-600 transition-colors">
              <div>
                <p className="font-semibold text-white">Pedido #{o.id}</p>
                <p className="text-sm text-zinc-500">{o.items_count} iten(s) · {o.created_at}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">R$ {parseFloat(o.total).toFixed(2).replace('.',',')}</p>
                <span className={`badge text-xs mt-1 ${statusColors[o.status] || 'bg-zinc-700 text-zinc-400'}`}>{o.status_label}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
