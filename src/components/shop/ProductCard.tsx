'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { wishlistApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price?: number;
  is_on_sale: boolean;
  discount_percent?: number;
  primary_image: string;
  primary_thumb: string;
  category?: string;
  average_rating?: number;
}

function formatPrice(value: number) {
  return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export default function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);
  const { user } = useAuthStore();

  const toggleWish = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Faça login para favoritar'); return; }
    try {
      const res = await wishlistApi.toggle(product.id);
      setWished(res.data.in_wishlist);
      toast.success(res.data.in_wishlist ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
    } catch { toast.error('Erro ao atualizar favoritos'); }
  };

  const rating = Math.round(product.average_rating ?? 0);

  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/60 group-hover:border-zinc-700 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/50">
        {product.primary_image ? (
          <Image
            src={product.primary_image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-2">
            <span className="text-5xl opacity-40">👕</span>
            <span className="text-xs text-zinc-700">Sem imagem</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.is_on_sale && product.discount_percent && (
            <span className="badge bg-brand-600 text-white shadow-lg shadow-brand-900/50">
              -{product.discount_percent}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={toggleWish}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            wished
              ? 'bg-brand-600/80 opacity-100'
              : 'bg-black/40 opacity-0 group-hover:opacity-100 hover:bg-black/60'
          }`}
        >
          {wished
            ? <HeartSolid className="w-4 h-4 text-white" />
            : <HeartIcon   className="w-4 h-4 text-white" />
          }
        </button>

        {/* Quick view label */}
        <div className="absolute bottom-0 left-0 right-0 py-3 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-xs font-semibold text-white tracking-widest uppercase">Ver produto</span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 px-0.5">
        {product.category && (
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5 font-medium">{product.category}</p>
        )}
        <h3 className="text-sm font-medium text-zinc-200 line-clamp-2 group-hover:text-white transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-[11px] leading-none ${i < rating ? 'text-yellow-400' : 'text-zinc-700'}`}>★</span>
            ))}
            <span className="text-[11px] text-zinc-600 ml-0.5">{product.average_rating?.toFixed(1)}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-bold text-white text-[15px]">
            R$&nbsp;{formatPrice(product.price)}
          </span>
          {product.is_on_sale && product.compare_price && (
            <span className="text-xs text-zinc-600 line-through">
              R$&nbsp;{formatPrice(product.compare_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
