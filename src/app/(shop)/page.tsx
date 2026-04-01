'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { productsApi, categoriesApi } from '@/lib/api';
import { ShieldCheckIcon, TruckIcon, ArrowPathIcon, StarIcon } from '@heroicons/react/24/outline';

const TICKER_ITEMS = [
  'Qualidade Premium', 'Frete Grátis acima de R$299', 'Troca em até 30 dias',
  'Pagamento Seguro', 'Regatas Japonesas Exclusivas', 'Roupas Fitness', 'Novidades Semanais',
  'Qualidade Premium', 'Frete Grátis acima de R$299', 'Troca em até 30 dias',
  'Pagamento Seguro', 'Regatas Japonesas Exclusivas', 'Roupas Fitness', 'Novidades Semanais',
];

const TRUST_ITEMS = [
  { icon: TruckIcon,        title: 'Envio Rápido',      desc: 'Via Melhor Envio em todo Brasil' },
  { icon: ShieldCheckIcon,  title: 'Pagamento Seguro',  desc: 'Mercado Pago · PIX · Cartão' },
  { icon: ArrowPathIcon,    title: 'Troca Fácil',       desc: 'Devoluções em até 30 dias' },
  { icon: StarIcon,         title: 'Qualidade',         desc: 'Produtos selecionados com cuidado' },
];

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
      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-dark-950" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-zinc-900/40 to-dark-950" />

        {/* Atmospheric glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-brand-700/8 rounded-full blur-[120px] pointer-events-none" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239,68,68,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239,68,68,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Decorative vertical lines */}
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-zinc-800/60 to-transparent hidden lg:block" />
        <div className="absolute right-32 top-0 h-full w-px bg-gradient-to-b from-transparent via-zinc-800/30 to-transparent hidden lg:block" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="max-w-2xl">
            {/* Label badge */}
            <div className="inline-flex items-center gap-2 bg-brand-600/15 border border-brand-600/25 text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse-slow" />
              Nova coleção disponível
            </div>

            {/* Heading */}
            <h1 className="font-display leading-none tracking-widest text-white mb-8">
              <span className="block text-6xl md:text-8xl lg:text-[9rem]">STREET</span>
              <span className="block text-6xl md:text-8xl lg:text-[9rem] text-gradient-brand">FIT</span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 max-w-md">
              Regatas japonesas exclusivas e roupas fitness para quem não abre mão do estilo.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="/produtos" className="btn-primary text-base px-8 py-4">
                Ver coleção
              </Link>
              <Link href="/categoria/regatas-japonesas" className="btn-outline text-base px-8 py-4">
                Regatas JP
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-10 pt-10 border-t border-zinc-800/60">
              <div>
                <p className="text-2xl font-display tracking-wider text-white">500+</p>
                <p className="text-xs text-zinc-500 mt-0.5">Clientes satisfeitos</p>
              </div>
              <div className="w-px h-10 bg-zinc-800" />
              <div>
                <p className="text-2xl font-display tracking-wider text-white">4.9</p>
                <p className="text-xs text-zinc-500 mt-0.5">Avaliação média ★</p>
              </div>
              <div className="w-px h-10 bg-zinc-800" />
              <div>
                <p className="text-2xl font-display tracking-wider text-white">30d</p>
                <p className="text-xs text-zinc-500 mt-0.5">Garantia de troca</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-700 animate-bounce">
          <span className="text-[10px] tracking-[0.25em] uppercase">Role</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-700 to-transparent" />
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="border-y border-zinc-800/60 bg-zinc-900/30 overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-6 text-sm text-zinc-500 font-medium">
              <span className="w-1 h-1 bg-brand-600 rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Categorias ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-10">
          <p className="text-xs font-semibold text-brand-500 tracking-[0.2em] uppercase mb-2">Explorar</p>
          <h2 className="section-title text-white">Categorias</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
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
                className="group relative bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/0 to-brand-600/0 group-hover:from-brand-600/5 group-hover:to-transparent transition-all duration-300" />
                <div className="relative">
                  <h3 className="font-semibold text-white text-base leading-tight">{cat.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1.5">{cat.products_count} produto{cat.products_count !== 1 ? 's' : ''}</p>
                </div>
                <span className="absolute bottom-5 right-5 text-zinc-700 group-hover:text-brand-500 group-hover:translate-x-1 transition-all duration-300 text-lg">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Destaques ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-brand-500 tracking-[0.2em] uppercase mb-2">Selecionados</p>
            <h2 className="section-title text-white">Destaques</h2>
          </div>
          <Link href="/produtos" className="group flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
            Ver todos
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[3/4] rounded-2xl" />
                <div className="mt-3 space-y-2">
                  <div className="skeleton h-3 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
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

      {/* ── Banner promocional ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative bg-gradient-to-r from-zinc-900 via-brand-950/40 to-zinc-900 border border-zinc-800/60 rounded-3xl p-10 md:p-16 overflow-hidden">
          {/* Background glows */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute right-0 top-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-brand-800/10 rounded-full blur-3xl" />
          </div>
          {/* Decorative lines */}
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-brand-600 to-transparent rounded-l-3xl" />

          <div className="relative max-w-lg">
            <span className="badge bg-brand-600/20 text-brand-400 border border-brand-600/30 mb-6 inline-flex">
              Oferta especial
            </span>
            <h2 className="font-display text-4xl md:text-6xl tracking-widest text-white mb-4 leading-none">
              FRETE GRÁTIS<br />
              <span className="text-gradient-brand">ACIMA DE R$ 299</span>
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Use o cupom <strong className="text-white bg-zinc-800 px-2 py-0.5 rounded-md font-mono text-sm">BEMVINDO10</strong> e ganhe 10% de desconto na primeira compra.
            </p>
            <Link href="/produtos" className="btn-primary inline-flex text-base px-8 py-4">
              Aproveitar agora →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="border-t border-zinc-800/60 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
