'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productsApi, categoriesApi } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [meta,     setMeta]     = useState({ last_page: 1, total: 0 });

  useEffect(() => {
    categoriesApi.show(slug as string).then((r) => setCategory(r.data)).catch(() => {});
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    productsApi.list({ category: slug, page, per_page: 12 })
      .then((r) => { setProducts(r.data.data); setMeta(r.data.meta); })
      .finally(() => setLoading(false));
  }, [slug, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Categoria</p>
        <h1 className="section-title text-white">{category?.name || '...'}</h1>
        {category?.description && <p className="text-zinc-400 mt-2 max-w-xl">{category.description}</p>}
        <p className="text-zinc-600 text-sm mt-1">{meta.total} produto(s)</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-zinc-800 rounded-2xl" />
              <div className="mt-3 space-y-2"><div className="h-3 bg-zinc-800 rounded w-3/4" /><div className="h-4 bg-zinc-800 rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-zinc-600">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg">Nenhum produto nesta categoria ainda.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {meta.last_page > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
