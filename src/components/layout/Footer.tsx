import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-zinc-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-2xl tracking-widest">
            STREET<span className="text-brand-500">FIT</span>
          </span>
          <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
            Moda urbana com atitude. Qualidade e estilo para o seu dia a dia.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Loja</h4>
          <ul className="space-y-2.5">
            {[
              { href: '/categoria/regatas-japonesas', label: 'Regatas JP' },
              { href: '/categoria/roupas-fitness',    label: 'Fitness' },
              { href: '/produtos',                    label: 'Todos produtos' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Conta</h4>
          <ul className="space-y-2.5">
            {[
              { href: '/auth/login',    label: 'Entrar' },
              { href: '/auth/cadastro', label: 'Criar conta' },
              { href: '/conta/pedidos', label: 'Meus pedidos' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Suporte</h4>
          <ul className="space-y-2.5 text-sm text-zinc-500">
            <li>📦 Envios via Melhor Envio</li>
            <li>🔒 Pagamento via Mercado Pago</li>
            <li>↩️ Troca em até 30 dias</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} StreetFit Store. Todos os direitos reservados.
      </div>
    </footer>
  );
}
