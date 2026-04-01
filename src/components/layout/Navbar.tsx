'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  ShoppingCartIcon, HeartIcon, UserIcon,
  Bars3Icon, XMarkIcon, MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
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
    { href: '/produtos',                    label: 'Todos' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-brand-700 text-white text-xs text-center py-1.5 px-4 font-medium tracking-wide hidden sm:block">
        🚚 Frete grátis acima de R$&nbsp;299 · Use <strong>BEMVINDO10</strong> e ganhe 10% na primeira compra
      </div>

      {/* Main nav */}
      <div className="bg-dark-950/95 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="shrink-0 group">
              <span className="font-display text-2xl tracking-widest">
                STREET<span className="text-brand-500 group-hover:text-brand-400 transition-colors">FIT</span>
              </span>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => {
                const active = pathname.startsWith(l.href) && l.href !== '/produtos'
                  ? true
                  : pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      active
                        ? 'text-white bg-zinc-800/60'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                  >
                    {l.label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (search) window.location.href = `/produtos?search=${search}`;
                }}
                className="hidden md:flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 focus-within:border-zinc-600 focus-within:bg-zinc-900 rounded-xl px-3 py-2 transition-all duration-200 w-40 focus-within:w-52"
              >
                <MagnifyingGlassIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none w-full min-w-0"
                />
              </form>

              {/* Cart */}
              <Link
                href="/carrinho"
                className="relative p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-all duration-200"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {count() > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none ring-2 ring-dark-950">
                    {count() > 9 ? '9+' : count()}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              {user && (
                <Link
                  href="/conta/favoritos"
                  className="p-2.5 text-zinc-400 hover:text-brand-400 hover:bg-zinc-800/60 rounded-lg transition-all duration-200 hidden md:flex"
                >
                  <HeartIcon className="w-5 h-5" />
                </Link>
              )}

              {/* User menu */}
              {user ? (
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-1.5 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-all duration-200">
                    <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                    <ChevronDownIcon className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-52 bg-dark-800 border border-zinc-700/60 rounded-2xl shadow-2xl shadow-black/50 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100">
                    <div className="px-4 py-2.5 border-b border-zinc-800 mb-1">
                      <p className="text-xs text-zinc-500">Logado como</p>
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    </div>
                    <Link href="/conta/pedidos" className="flex items-center px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors gap-2">
                      📦 Meus pedidos
                    </Link>
                    <Link href="/conta/perfil"  className="flex items-center px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors gap-2">
                      👤 Perfil
                    </Link>
                    <Link href="/conta/favoritos" className="flex items-center px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors gap-2">
                      ❤️ Favoritos
                    </Link>
                    <div className="border-t border-zinc-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2.5 text-sm text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60 transition-colors gap-2 rounded-b-xl"
                      >
                        ↩ Sair
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-all duration-200"
                >
                  <UserIcon className="w-4 h-4" />
                  Entrar
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-all duration-200"
              >
                {open ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-zinc-800/60 animate-slide-down">
            {/* Mobile search */}
            <div className="px-4 pt-4 pb-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (search) { window.location.href = `/produtos?search=${search}`; setOpen(false); }
                }}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5"
              >
                <MagnifyingGlassIcon className="w-4 h-4 text-zinc-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none flex-1"
                />
              </form>
            </div>

            <div className="px-4 py-2 space-y-0.5">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-3 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-zinc-800/60 mx-4 my-2" />

            <div className="px-4 pb-4 space-y-0.5">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3">
                    <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.name.split(' ')[0]}</p>
                      <p className="text-xs text-zinc-500">Minha conta</p>
                    </div>
                  </div>
                  <Link href="/conta/pedidos"   onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-colors">📦 Meus pedidos</Link>
                  <Link href="/conta/favoritos" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-colors">❤️ Favoritos</Link>
                  <Link href="/conta/perfil"    onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-colors">👤 Perfil</Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-3 text-sm text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60 rounded-xl transition-colors">↩ Sair</button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full btn-primary py-3 text-sm"
                >
                  <UserIcon className="w-4 h-4" />
                  Entrar / Criar conta
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
