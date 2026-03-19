import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-zinc-500">Carregando...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
