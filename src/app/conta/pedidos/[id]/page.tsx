'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ordersApi } from '@/lib/api';

const statusColors: Record<string, string> = {
  pending:   'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  paid:      'bg-green-600/20  text-green-400  border-green-600/30',
  shipped:   'bg-blue-600/20   text-blue-400   border-blue-600/30',
  delivered: 'bg-green-600/20  text-green-400  border-green-600/30',
  cancelled: 'bg-red-600/20    text-red-400    border-red-600/30',
};

export default function OrderDetailPage() {
  const { id }    = useParams();
  const [order,   setOrder]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.show(Number(id)).then((r) => setOrder(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-4">
      <div className="h-8 bg-zinc-800 rounded w-1/3" />
      <div className="card h-40" />
    </div>
  );

  if (!order) return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center text-zinc-600">
      <p>Pedido não encontrado.</p>
      <Link href="/conta/pedidos" className="text-brand-400 mt-4 block">← Voltar</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/conta/pedidos" className="text-zinc-500 hover:text-zinc-300 transition-colors">←</Link>
        <div>
          <h1 className="section-title text-white text-3xl">Pedido #{order.id}</h1>
          <p className="text-zinc-500 text-sm">{order.created_at}</p>
        </div>
        <span className={`badge border ml-auto ${statusColors[order.status] || 'bg-zinc-700 text-zinc-400'}`}>
          {order.status_label}
        </span>
      </div>

      {/* Itens */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-white mb-4">Itens do pedido</h2>
        <div className="space-y-4">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-800">
                {item.image && <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="64px" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{item.product_name}</p>
                {item.size && <p className="text-xs text-zinc-500">Tamanho: {item.size}</p>}
                <p className="text-xs text-zinc-500 mt-0.5">Qtd: {item.quantity}</p>
              </div>
              <p className="font-semibold text-white text-sm whitespace-nowrap">
                R$ {parseFloat(item.total_price).toFixed(2).replace('.', ',')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Totais + Endereço */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">Valores</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>R$ {parseFloat(order.subtotal).toFixed(2).replace('.', ',')}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-400"><span>Desconto</span><span>-R$ {parseFloat(order.discount).toFixed(2).replace('.', ',')}</span></div>}
            <div className="flex justify-between text-zinc-400"><span>Frete ({order.shipping_service_name})</span><span>R$ {parseFloat(order.shipping_cost).toFixed(2).replace('.', ',')}</span></div>
            <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-zinc-800">
              <span>Total</span><span>R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
          {order.tracking_code && (
            <div className="mt-4 bg-blue-600/10 border border-blue-600/30 rounded-xl p-3">
              <p className="text-xs text-blue-400 font-semibold">🚚 Código de rastreio</p>
              <p className="text-sm text-white font-mono mt-1">{order.tracking_code}</p>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-white mb-4">Endereço de entrega</h2>
          {order.shipping_address && (
            <div className="text-sm text-zinc-400 space-y-1">
              <p className="text-white font-medium">{order.shipping_address.name}</p>
              <p>{order.shipping_address.street}, {order.shipping_address.number}</p>
              {order.shipping_address.complement && <p>{order.shipping_address.complement}</p>}
              <p>{order.shipping_address.neighborhood}</p>
              <p>{order.shipping_address.city}/{order.shipping_address.state}</p>
              <p>CEP {order.shipping_address.zipcode}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
