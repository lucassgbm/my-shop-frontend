'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { productsApi, categoriesApi } from '@/lib/api';

export default function HomePage() {
  const [featured,   setFeatured]   = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.featured().then((r) => setFeatured(r.data)),
      categoriesApi.list().then((r) => setCategories(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-zinc-900 to-dark-950" />
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #ef444420 40px, #ef444420 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #ef444420 40px, #ef444420 41px)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <span className="badge bg-brand-600/20 text-brand-400 border border-brand-600/30 mb-6 inline-flex">
              ✦ Nova coleção disponível
            </span>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl tracking-widest leading-none text-white mb-6">
              STREET<br />
              <span className="text-brand-500">FIT</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
              Regatas japonesas exclusivas e roupas fitness para quem não abre mão do estilo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/produtos" className="btn-primary text-base px-8 py-4">Ver coleção</Link>
              <Link href="/categoria/regatas-japonesas" className="btn-outline text-base px-8 py-4">Regatas JP</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Role</span>
          <div className="w-px h-8 bg-zinc-700" />
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="section-title text-white mb-10">Categorias</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-800 rounded-2xl h-24" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-zinc-600 text-sm">Nenhuma categoria disponível.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">{cat.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{cat.products_count} produtos</p>
                <span className="absolute bottom-4 right-4 text-zinc-700 group-hover:text-brand-600 transition-colors text-xl">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Destaques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <h2 className="section-title text-white">Destaques</h2>
          <Link href="/produtos" className="text-sm text-zinc-400 hover:text-white transition-colors">Ver todos →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-zinc-800 rounded-2xl" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-zinc-600 text-sm">Nenhum produto em destaque.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative bg-gradient-to-r from-brand-900 via-brand-800 to-zinc-900 rounded-3xl p-10 md:p-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #ef4444 0%, transparent 60%)' }}
          />
          <div className="relative max-w-lg">
            <h2 className="font-display text-4xl md:text-5xl tracking-widest text-white mb-4">
              FRETE GRÁTIS<br />
              <span className="text-brand-300">ACIMA DE R$ 299</span>
            </h2>
            <p className="text-zinc-300 mb-8">
              Use o cupom <strong className="text-white">BEMVINDO10</strong> e ganhe 10% de desconto na primeira compra.
            </p>
            <Link href="/produtos" className="btn-primary inline-flex">Aproveitar →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
