import Link from 'next/link';

const SHOP_LINKS = [
  { href: '/categoria/regatas-japonesas', label: 'Regatas JP' },
  { href: '/categoria/roupas-fitness',    label: 'Fitness' },
  { href: '/produtos',                    label: 'Todos os produtos' },
];

const ACCOUNT_LINKS = [
  { href: '/auth/login',    label: 'Entrar' },
  { href: '/auth/cadastro', label: 'Criar conta' },
  { href: '/conta/pedidos', label: 'Meus pedidos' },
  { href: '/conta/perfil',  label: 'Perfil' },
];

const SUPPORT_LINKS = [
  { label: 'Envios via Melhor Envio' },
  { label: 'Pagamento via Mercado Pago' },
  { label: 'Troca em até 30 dias' },
  { label: 'Atendimento pelo Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-zinc-800/60 mt-0">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-4 pr-0 md:pr-8">
          <Link href="/">
            <span className="font-display text-2xl tracking-widest">
              STREET<span className="text-brand-500">FIT</span>
            </span>
          </Link>
          <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
            Moda urbana com atitude. Qualidade e estilo para quem vive intensamente.
          </p>

          {/* Payment methods */}
          <div className="mt-6">
            <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-3">Formas de pagamento</p>
            <div className="flex items-center gap-2 flex-wrap">
              {['PIX', 'Cartão', 'Débito', 'Boleto'].map((m) => (
                <span key={m} className="text-[11px] font-medium text-zinc-500 bg-zinc-800/60 border border-zinc-700/60 px-2.5 py-1 rounded-lg">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Loja */}
        <div className="col-span-1 md:col-span-2 md:col-start-6">
          <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-5">Loja</h4>
          <ul className="space-y-3">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Conta */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-5">Conta</h4>
          <ul className="space-y-3">
            {ACCOUNT_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Suporte */}
        <div className="col-span-2 md:col-span-2">
          <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.15em] mb-5">Suporte</h4>
          <ul className="space-y-3">
            {SUPPORT_LINKS.map((item) => (
              <li key={item.label} className="flex items-start gap-2 text-sm text-zinc-500">
                <span className="mt-0.5 text-zinc-600">·</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} StreetFit Store. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-700">Feito com ❤️ no Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
