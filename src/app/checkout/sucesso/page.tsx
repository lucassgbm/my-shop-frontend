'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const params  = useSearchParams();
  const orderId = params.get('order');
  const pix     = params.get('pix');

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="font-display text-5xl tracking-widest text-white mb-3">PEDIDO FEITO!</h1>
        <p className="text-zinc-400 mb-2">Pedido <strong className="text-white">#{orderId}</strong> criado com sucesso.</p>

        {pix && (
          <div className="card p-6 my-6 text-left">
            <h2 className="font-semibold text-white mb-3 text-center">⚡ Pague via PIX</h2>
            <p className="text-xs text-zinc-500 mb-3 text-center">Copie o código abaixo ou escaneie o QR Code no seu banco</p>
            <div className="bg-zinc-900 rounded-xl p-3 break-all text-xs text-zinc-300 font-mono select-all">
              {decodeURIComponent(pix)}
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(decodeURIComponent(pix)); }}
              className="btn-primary w-full mt-4"
            >
              Copiar código PIX
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-6">
          <Link href={`/conta/pedidos/${orderId}`} className="btn-outline">Ver meu pedido</Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Voltar para a loja</Link>
        </div>
      </div>
    </div>
  );
}
