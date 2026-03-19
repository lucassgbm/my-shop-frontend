'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<any>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await authApi.login(form);
      setAuth(res.data.user, res.data.token);
      toast.success(`Bem-vindo, ${res.data.user.name.split(' ')[0]}!`);
      router.push('/');
    } catch (err: any) {
      const errs = err.response?.data?.errors;
      if (errs) setErrors(errs);
      else toast.error(err.response?.data?.message || 'Credenciais inválidas.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl tracking-widest">
            STREET<span className="text-brand-500">FIT</span>
          </Link>
          <p className="text-zinc-500 mt-2 text-sm">Entre na sua conta</p>
        </div>

        <div className="card p-8">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-zinc-400 block mb-1.5">E-mail</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input" placeholder="seu@email.com" required />
              {errors.email && <p className="text-brand-400 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-400 block mb-1.5">Senha</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input" placeholder="••••••••" required />
              {errors.password && <p className="text-brand-400 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Não tem conta?{' '}
            <Link href="/auth/cadastro" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
