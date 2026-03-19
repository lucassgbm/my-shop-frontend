'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { productsApi, cartApi } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { ShoppingCartIcon, HeartIcon, TruckIcon } from '@heroicons/react/24/outline';

export default function ProductPage() {
  const { slug }   = useParams();
  const router     = useRouter();
  const { setCart } = useCartStore();

  const [product,  setProduct]  = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [variant,  setVariant]  = useState<any>(null);
  const [qty,      setQty]      = useState(1);
  const [adding,   setAdding]   = useState(false);
  const [zoom,     setZoom]     = useState(false);

  useEffect(() => {
    productsApi.show(slug as string)
      .then((r) => { setProduct(r.data); if (r.data.variants?.[0]) setVariant(r.data.variants[0]); })
      .catch(() => router.push('/produtos'))
      .finally(() => setLoading(false));
  }, [slug]);

  const addToCart = async () => {
    if (!variant && product?.variants?.length > 0) { toast.error('Selecione um tamanho'); return; }
    setAdding(true);
    try {
      const res = await cartApi.addItem({ product_id: product.id, variant_id: variant?.id, quantity: qty });
      setCart(res.data);
      toast.success('Adicionado ao carrinho! 🛒');
    } catch { toast.error('Erro ao adicionar'); }
    finally { setAdding(false); }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-12 animate-pulse">
      <div className="aspect-square bg-zinc-800 rounded-2xl" />
      <div className="space-y-4 pt-4">
        <div className="h-8 bg-zinc-800 rounded w-3/4" />
        <div className="h-6 bg-zinc-800 rounded w-1/3" />
        <div className="h-12 bg-zinc-800 rounded" />
      </div>
    </div>
  );

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [{ url: product.primary_image, thumb: product.primary_image }];
  const sizes  = [...new Set(product.variants?.map((v: any) => v.size))] as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
        <a href="/" className="hover:text-zinc-300">Início</a>
        <span>›</span>
        <a href={`/categoria/${product.category?.slug}`} className="hover:text-zinc-300">{product.category?.name}</a>
        <span>›</span>
        <span className="text-zinc-400">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Galeria */}
        <div className="space-y-3">
          <div
            className="relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 cursor-zoom-in"
            onClick={() => setZoom(!zoom)}
          >
            {images[activeImg]?.url ? (
              <Image
                src={images[activeImg].url}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-500 ${zoom ? 'scale-150' : 'scale-100'}`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700 text-8xl">👕</div>
            )}
            {product.is_on_sale && (
              <span className="absolute top-3 left-3 badge bg-brand-600 text-white">-{product.discount_percent}% OFF</span>
            )}
            <span className="absolute bottom-3 right-3 text-xs text-zinc-500 bg-black/50 px-2 py-1 rounded-full">🔍 clique p/ zoom</span>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => { setActiveImg(i); setZoom(false); }}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-brand-500' : 'border-zinc-700 opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img.thumb || img.url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5 lg:py-2">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">{product.category?.name}</p>
            <h1 className="font-display text-4xl md:text-5xl tracking-widest text-white mt-1">{product.name}</h1>
            {product.average_rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {'★★★★★'.split('').map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.round(product.average_rating) ? 'text-yellow-400' : 'text-zinc-700'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm text-zinc-500">({product.reviews?.length} avaliações)</span>
              </div>
            )}
          </div>

          {/* Preço */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">R$ {product.price}</span>
              {product.is_on_sale && <span className="text-xl text-zinc-500 line-through">R$ {product.compare_price}</span>}
            </div>
            <p className="text-sm text-zinc-400 mt-1">ou 3x de R$ {(product.price / 3).toFixed(2).replace('.', ',')} sem juros</p>
          </div>

          {/* Tamanhos */}
          {sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-zinc-300">Tamanho</label>
                <button className="text-xs text-zinc-500 hover:text-zinc-300">Guia de tamanhos</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants?.filter((v: any, i: number, arr: any[]) => arr.findIndex(x => x.size === v.size) === i)
                  .map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => v.stock > 0 && setVariant(v)}
                      disabled={v.stock === 0}
                      className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                        variant?.size === v.size
                          ? 'border-brand-500 bg-brand-600/20 text-white'
                          : v.stock === 0
                          ? 'border-zinc-800 text-zinc-700 line-through cursor-not-allowed opacity-50'
                          : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {v.size}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Quantidade */}
          <div>
            <label className="text-sm font-semibold text-zinc-300 block mb-2">Quantidade</label>
            <div className="flex items-center w-fit border border-zinc-700 rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-lg">−</button>
              <span className="w-12 text-center text-white font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(10, qty + 1))} className="w-10 h-10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-lg">+</button>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={addToCart}
              disabled={adding}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-base"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {adding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
            </button>
            <button className="w-12 h-[52px] border border-zinc-700 hover:border-brand-500 hover:text-brand-400 rounded-xl transition-colors text-zinc-500 flex items-center justify-center">
              <HeartIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Info */}
          <div className="border border-zinc-800 rounded-xl p-4 space-y-2 text-sm text-zinc-500">
            <p className="flex items-center gap-2"><TruckIcon className="w-4 h-4" /> Frete calculado no checkout</p>
            <p>📦 {product.weight}kg · {product.width}×{product.height}×{product.length}cm</p>
            <p>🔒 Pagamento seguro via Mercado Pago</p>
            <p>↩️ Troca em até 30 dias</p>
          </div>

          {/* Descrição */}
          {product.description && (
            <div className="border-t border-zinc-800 pt-5">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Descrição</h3>
              <div className="prose prose-invert prose-sm max-w-none text-zinc-400"
                dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
        </div>
      </div>

      {/* Avaliações */}
      {product.reviews?.length > 0 && (
        <section className="mt-20 border-t border-zinc-800 pt-12">
          <h2 className="section-title text-white mb-8">Avaliações</h2>
          <div className="space-y-4">
            {product.reviews.map((r: any) => (
              <div key={r.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{r.user_name}</p>
                    <div className="flex mt-1">
                      {'★★★★★'.split('').map((_, i) => (
                        <span key={i} className={i < r.rating ? 'text-yellow-400' : 'text-zinc-700'}>★</span>
                      ))}
                    </div>
                    {r.title && <p className="text-white font-medium mt-2">{r.title}</p>}
                    {r.body  && <p className="text-zinc-400 text-sm mt-1">{r.body}</p>}
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0">{r.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
