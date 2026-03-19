'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/lib/store';

const navLinks = [
  { href: '/conta/pedidos',  label: '📦 Meus Pedidos' },
  { href: '/conta/favoritos',label: '♡  Favoritos'    },
  { href: '/conta/perfil',   label: '👤 Perfil'       },
];

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  const { user }   = useAuthStore();
  const router     = useRouter();
  const pathname   = usePathname();

  useEffect(() => {
    if (!user) router.push('/auth/login');
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-48 shrink-0">
            <div className="card p-2 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    pathname.startsWith(l.href)
                      ? 'bg-brand-600/20 text-white font-medium'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
