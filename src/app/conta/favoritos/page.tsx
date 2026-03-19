'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { wishlistApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import ProductCard from '@/components/shop/ProductCard';
import { HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user }  = useAuthStore();
  const router    = useRouter();
  const [items,   setItems]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    wishlistApi.list()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="h-8 bg-zinc-800 rounded w-1/4 mb-8 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-zinc-800 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title text-white mb-8">Favoritos</h1>

      {items.length === 0 ? (
        <div className="text-center py-24 text-zinc-600">
          <HeartIcon className="w-16 h-16 mx-auto mb-4 text-zinc-800" />
          <p className="text-lg mb-6">Nenhum produto favoritado ainda.</p>
          <Link href="/produtos" className="btn-primary">Explorar produtos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} product={{
              ...item.product,
              primary_image: item.product.primary_image,
              primary_thumb: item.product.primary_image,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
