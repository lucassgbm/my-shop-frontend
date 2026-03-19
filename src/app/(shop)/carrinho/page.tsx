'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { couponApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { items, coupon, subtotal, discount, total, count, updateItem, removeItem, setCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [loading,    setLoading]    = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setLoading(true);
    try {
      const res = await couponApi.validate(couponCode.toUpperCase(), subtotal());
      setCoupon({ id: 0, code: res.data.code, type: res.data.type, value: res.data.value });
      toast.success(`Cupom ${res.data.code} aplicado! -R$ ${Number(res.data.discount).toFixed(2).replace('.', ',')}`);
      setCouponCode('');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Cupom inválido');
    } finally { setLoading(false); }
  };

  if (items.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <ShoppingCartIcon className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
      <h1 className="font-display text-4xl tracking-widest text-white mb-3">Carrinho vazio</h1>
      <p className="text-zinc-500 mb-8">Você ainda não adicionou nenhum produto.</p>
      <Link href="/produtos" className="btn-primary">Ver produtos</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title text-white mb-8">
        Carrinho <span className="text-zinc-600 text-2xl font-sans font-normal">({count()} iten(s))</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Itens */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.key} className="card p-4 flex gap-4">
              <div className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-zinc-800">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white text-sm line-clamp-2">{item.name}</h3>
                {item.size && <p className="text-xs text-zinc-500 mt-0.5">Tamanho: {item.size}</p>}
                <p className="text-brand-400 font-semibold mt-1 text-sm">
                  R$ {Number(item.price).toFixed(2).replace('.', ',')}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
                    <button onClick={() => updateItem(item.key, item.quantity - 1)}
                      className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">−</button>
                    <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                    <button onClick={() => updateItem(item.key, item.quantity + 1)}
                      className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">+</button>
                  </div>
                  <button onClick={() => { removeItem(item.key); toast.success('Item removido'); }}
                    className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-white">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="card p-6 space-y-4 h-fit">
          <h2 className="font-semibold text-white text-lg">Resumo</h2>

          {/* Cupom */}
          {!coupon ? (
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                placeholder="CUPOM"
                className="input text-sm flex-1"
              />
              <button onClick={applyCoupon} disabled={loading}
                className="btn-outline text-sm px-4 py-2 whitespace-nowrap">
                {loading ? '...' : 'Aplicar'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-brand-600/10 border border-brand-600/30 rounded-xl px-3 py-2">
              <span className="text-sm text-brand-400 font-medium">🏷️ {coupon.code}</span>
              <button onClick={() => setCoupon(null)} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
                Remover
              </button>
            </div>
          )}

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span>R$ {subtotal().toFixed(2).replace('.', ',')}</span>
            </div>
            {discount() > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Desconto</span>
                <span>-R$ {discount().toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Frete</span>
              <span className="text-zinc-500">Calculado no checkout</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-white text-lg pt-2 border-t border-zinc-800">
            <span>Total</span>
            <span>R$ {total().toFixed(2).replace('.', ',')}</span>
          </div>

          <Link href="/checkout" className="btn-primary w-full text-center block py-4">
            Finalizar compra
          </Link>
          <Link href="/produtos" className="text-sm text-zinc-500 hover:text-zinc-300 text-center block transition-colors">
            ← Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
