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

  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-zinc-600 transition-all duration-300">
        {product.primary_image ? (
          <Image
            src={product.primary_image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-6xl">👕</div>
        )}

        {product.is_on_sale && (
          <span className="absolute top-2 left-2 badge bg-brand-600 text-white">
            -{product.discount_percent}%
          </span>
        )}

        <button
          onClick={toggleWish}
          className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70"
        >
          {wished
            ? <HeartSolid className="w-4 h-4 text-brand-500" />
            : <HeartIcon   className="w-4 h-4 text-white" />
          }
        </button>
      </div>

      <div className="pt-3 px-1">
        {product.category && (
          <p className="text-xs text-zinc-500 mb-0.5">{product.category}</p>
        )}
        <h3 className="text-sm font-medium text-zinc-100 line-clamp-2 group-hover:text-white transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-semibold text-white">
            R$ {product.price}
          </span>
          {product.is_on_sale && product.compare_price && (
            <span className="text-xs text-zinc-500 line-through">
              R$ {product.compare_price}
            </span>
          )}
        </div>
        {(product.average_rating ?? 0) > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {'★★★★★'.split('').map((s, i) => (
              <span key={i} className={`text-xs ${i < Math.round(product.average_rating!) ? 'text-yellow-400' : 'text-zinc-700'}`}>★</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
