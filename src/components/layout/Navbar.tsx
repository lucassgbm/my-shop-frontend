'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ShoppingCartIcon, HeartIcon, UserIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuthStore, useCartStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { count } = useCartStore();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    logout();
    toast.success('Até logo!');
  };

  const navLinks = [
    { href: '/categoria/regatas-japonesas', label: 'Regatas JP' },
    { href: '/categoria/roupas-fitness',    label: 'Fitness' },
    { href: '/produtos',                    label: 'Tudo' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-950/95 backdrop-blur-md border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="font-display text-2xl tracking-widest">
              STREET<span className="text-brand-500">FIT</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(l.href) ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <form
              onSubmit={(e) => { e.preventDefault(); if (search) window.location.href = `/produtos?search=${search}`; }}
              className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none w-36"
              />
            </form>

            {/* Cart */}
            <Link href="/carrinho" className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <ShoppingCartIcon className="w-5 h-5" />
              {count() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count() > 9 ? '9+' : count()}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            {user && (
              <Link href="/conta/favoritos" className="p-2 text-zinc-400 hover:text-brand-400 transition-colors hidden md:block">
                <HeartIcon className="w-5 h-5" />
              </Link>
            )}

            {/* User menu */}
            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-2 p-2 text-zinc-400 hover:text-white transition-colors">
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-dark-800 border border-zinc-700 rounded-xl shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/conta/pedidos" className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">Meus pedidos</Link>
                  <Link href="/conta/perfil"  className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">Perfil</Link>
                  <hr className="border-zinc-700 my-1" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">Sair</button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors p-2">
                <UserIcon className="w-5 h-5" />
                Entrar
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-zinc-400">
              {open ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-zinc-800 py-4 space-y-1 animate-slide-down">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block px-2 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            <hr className="border-zinc-800 my-2" />
            {user ? (
              <>
                <Link href="/conta/pedidos"  onClick={() => setOpen(false)} className="block px-2 py-2.5 text-sm text-zinc-300">Meus pedidos</Link>
                <Link href="/conta/favoritos" onClick={() => setOpen(false)} className="block px-2 py-2.5 text-sm text-zinc-300">Favoritos</Link>
                <button onClick={handleLogout} className="block px-2 py-2.5 text-sm text-zinc-500">Sair</button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setOpen(false)} className="block px-2 py-2.5 text-sm text-brand-400">Entrar / Criar conta</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
