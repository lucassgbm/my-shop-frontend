'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/shop/ProductCard';
import { productsApi, categoriesApi } from '@/lib/api';

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [products,   setProducts]   = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [meta,       setMeta]       = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading,    setLoading]    = useState(true);
  const [filters,    setFilters]    = useState({
    search:    searchParams.get('search')   || '',
    category:  searchParams.get('category') || '',
    sort:      searchParams.get('sort')     || 'created_at',
    min_price: searchParams.get('min')      || '',
    max_price: searchParams.get('max')      || '',
    page:      1,
  });

  useEffect(() => { categoriesApi.list().then((r) => setCategories(r.data)); }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.list({ ...filters, per_page: 12 });
      setProducts(res.data.data);
      setMeta(res.data.meta);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key: string, val: string | number) => {
    setFilters((f) => ({ ...f, [key]: val, page: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title text-white">Produtos</h1>
          <p className="text-zinc-500 text-sm mt-1">{meta.total} itens encontrados</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 shrink-0 space-y-6">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-3">Buscar</label>
            <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Nome do produto..." className="input text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-3">Categoria</label>
            <div className="space-y-1.5">
              <button onClick={() => updateFilter('category', '')}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!filters.category ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                Todas
              </button>
              {categories.map((c: any) => (
                <button key={c.id} onClick={() => updateFilter('category', c.slug)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${filters.category === c.slug ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-3">Ordenar</label>
            <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input text-sm">
              <option value="created_at">Mais recentes</option>
              <option value="price">Menor preço</option>
              <option value="-price">Maior preço</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-3">Preço</label>
            <div className="flex gap-2">
              <input value={filters.min_price} onChange={(e) => updateFilter('min_price', e.target.value)} placeholder="Min" className="input text-sm" type="number" />
              <input value={filters.max_price} onChange={(e) => updateFilter('max_price', e.target.value)} placeholder="Max" className="input text-sm" type="number" />
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-zinc-800 rounded-2xl" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-3/4" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-lg font-medium">Nenhum produto encontrado</p>
              <button onClick={() => setFilters({ search: '', category: '', sort: 'created_at', min_price: '', max_price: '', page: 1 })}
                className="mt-4 text-sm text-brand-400 hover:text-brand-300">Limpar filtros</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {meta.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setFilters((f) => ({ ...f, page: p }))}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${meta.current_page === p ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
