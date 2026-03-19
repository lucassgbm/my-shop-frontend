import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-10 bg-zinc-800 rounded w-1/4 mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-zinc-800 rounded-2xl" />
              <div className="mt-3 space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
