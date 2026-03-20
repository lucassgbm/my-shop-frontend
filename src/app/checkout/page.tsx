'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import { addressesApi, shippingApi, checkoutApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { TruckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, subtotal, discount, total, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [addresses,   setAddresses]   = useState<any[]>([]);
  const [addressId,   setAddressId]   = useState<number | null>(null);
  const [shipping,    setShipping]    = useState<any[]>([]);
  const [shippingSel, setShippingSel] = useState<any>(null);
  const [cep,         setCep]         = useState('');
  const [payMethod,   setPayMethod]   = useState<'pix' | 'card'>('pix');
  const [loading,     setLoading]     = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [hydrated,    setHydrated]    = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) { router.push('/auth/login'); return; }
    if (items.length === 0) { router.push('/carrinho'); return; }
    addressesApi.list()
      .then((r) => {
        console.log('Endereços carregados:', r.data);
        setAddresses(r.data);
        if (r.data.length > 0) setAddressId(r.data[0].id);
      })
      .catch((err) => {
        console.error('Erro ao carregar endereços:', err.response?.status, err.response?.data);
      });
  }, [user, items.length]);

  const calcShipping = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length < 8) { toast.error('CEP inválido'); return; }
    setCalcLoading(true);
    try {
      const res = await shippingApi.calculate(cleanCep, items.map((i) => ({
        weight: 0.3, width: 20, height: 5, length: 30, quantity: i.quantity,
      })));
      const options = Array.isArray(res.data) ? res.data : [];
      setShipping(options);
      if (options.length > 0) setShippingSel(options[0]);
      else toast.error('Nenhuma opção de frete disponível para este CEP');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Erro ao calcular frete');
    } finally { setCalcLoading(false); }
  };

  const submit = async () => {
    if (!addressId)   { toast.error('Selecione um endereço'); return; }
    if (!shippingSel) { toast.error('Calcule o frete primeiro'); return; }
    if (items.length === 0) { toast.error('Carrinho vazio'); return; }

    setLoading(true);
    try {
      const payload = {
        address_id:          addressId,
        shipping_service_id: shippingSel.id,
        shipping_cost:       parseFloat(shippingSel.price),
        shipping_name:       `${shippingSel.company} - ${shippingSel.name}`,
        coupon_code:         coupon?.code ?? null,
        items:               items.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id ?? null,
          quantity:   i.quantity,
          price:      i.price,
        })),
      };

      const res = await checkoutApi.pix(payload);
      clearCart();
      router.push(
        `/checkout/sucesso?order=${res.data.order_id}&pix=${encodeURIComponent(res.data.pix_code || '')}`
      );
    } catch (e: any) {
      const msg = e.response?.data?.error || e.response?.data?.message || 'Erro ao finalizar pedido';
      toast.error(msg);
      console.error('Checkout error:', e.response?.data);
    } finally { setLoading(false); }
  };

  const shippingPrice = shippingSel ? parseFloat(shippingSel.price) : 0;
  const grandTotal    = total() + shippingPrice;

  if (!hydrated) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || items.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title text-white mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Endereço */}
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4">📍 Endereço de entrega</h2>
            {addresses.length === 0 ? (
              <div className="text-sm text-zinc-500">
                Nenhum endereço cadastrado.{' '}
                <a href="/conta/perfil" className="text-brand-400 hover:text-brand-300">Adicionar endereço →</a>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <label key={a.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      addressId === a.id ? 'border-brand-500 bg-brand-600/10' : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <input type="radio" name="address" value={a.id}
                      checked={addressId === a.id}
                      onChange={() => setAddressId(a.id)}
                      className="mt-0.5 accent-red-600"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-white">{a.name}</p>
                      <p className="text-zinc-400">{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ''}</p>
                      <p className="text-zinc-500">{a.neighborhood} · {a.city}/{a.state} · CEP {a.zipcode}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Frete */}
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <TruckIcon className="w-5 h-5" /> Calcular frete
            </h2>
            <div className="flex gap-3">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                className="input flex-1"
                maxLength={9}
                onKeyDown={(e) => e.key === 'Enter' && calcShipping()}
              />
              <button onClick={calcShipping} disabled={calcLoading}
                className="btn-outline whitespace-nowrap px-6">
                {calcLoading ? 'Calculando...' : 'Calcular'}
              </button>
            </div>

            {shipping.length > 0 && (
              <div className="mt-4 space-y-2">
                {shipping.map((s: any) => (
                  <label key={s.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      shippingSel?.id === s.id ? 'border-brand-500 bg-brand-600/10' : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping"
                        checked={shippingSel?.id === s.id}
                        onChange={() => setShippingSel(s)}
                        className="accent-red-600"
                      />
                      <span className="text-sm text-zinc-300">
                        <strong className="text-white">{s.company}</strong> — {s.name}
                      </span>
                    </div>
                    <div className="text-right text-sm shrink-0 ml-4">
                      <p className="font-semibold text-white">R$ {parseFloat(s.price).toFixed(2).replace('.', ',')}</p>
                      <p className="text-zinc-500 text-xs">{s.delivery_time} dias úteis</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Pagamento */}
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <LockClosedIcon className="w-5 h-5" /> Forma de pagamento
            </h2>
            <div className="flex gap-3 mb-4">
              {(['pix', 'card'] as const).map((m) => (
                <button key={m} onClick={() => setPayMethod(m)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    payMethod === m
                      ? 'border-brand-500 bg-brand-600/10 text-white'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {m === 'pix' ? '⚡ PIX' : '💳 Cartão'}
                </button>
              ))}
            </div>
            {payMethod === 'pix' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm">
                <p className="font-medium text-white mb-1">Pagamento instantâneo</p>
                <p className="text-zinc-500">Você receberá o QR Code após confirmar. O pedido é confirmado automaticamente assim que o pagamento for detectado.</p>
              </div>
            )}
            {payMethod === 'card' && (
              <p className="text-sm text-zinc-500">Integração com cartão via Mercado Pago em breve.</p>
            )}
          </div>
        </div>

        {/* Resumo */}
        <div className="card p-6 space-y-4 h-fit sticky top-20">
          <h2 className="font-semibold text-white">Resumo do pedido</h2>

          <div className="space-y-2 text-sm max-h-48 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.key} className="flex justify-between text-zinc-400">
                <span className="line-clamp-1 flex-1 mr-2">
                  {i.name}{i.size ? ` (${i.size})` : ''} ×{i.quantity}
                </span>
                <span className="shrink-0">R$ {(i.price * i.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>R$ {subtotal().toFixed(2).replace('.', ',')}</span>
            </div>
            {discount() > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Desconto ({coupon?.code})</span>
                <span>-R$ {discount().toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-400">
              <span>Frete</span>
              <span>{shippingSel ? `R$ ${Number(shippingPrice).toFixed(2).replace('.', ',')}` : 'A calcular'}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-white text-lg border-t border-zinc-800 pt-3">
            <span>Total</span>
            <span>R$ {Number(grandTotal).toFixed(2).replace('.', ',')}</span>
          </div>

          <button
            onClick={submit}
            disabled={loading || !addressId || !shippingSel || items.length === 0}
            className="btn-primary w-full py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : `Confirmar pedido · R$ ${Number(grandTotal).toFixed(2).replace('.', ',')}`}
          </button>

          <p className="text-xs text-zinc-600 text-center">🔒 Pagamento seguro via Mercado Pago</p>
        </div>
      </div>
    </div>
  );
}
