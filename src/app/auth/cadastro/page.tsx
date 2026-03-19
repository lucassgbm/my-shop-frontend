'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form,    setForm]    = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<any>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const res = await authApi.register(form);
      setAuth(res.data.user, res.data.token);
      toast.success('Conta criada com sucesso!');
      router.push('/');
    } catch (err: any) {
      const errs = err.response?.data?.errors;
      if (errs) setErrors(errs);
      else toast.error('Erro ao criar conta.');
    } finally { setLoading(false); }
  };

  const field = (key: string) => ({
    value:    form[key as keyof typeof form],
    onChange: (e: any) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl tracking-widest">
            STREET<span className="text-brand-500">FIT</span>
          </Link>
          <p className="text-zinc-500 mt-2 text-sm">Crie sua conta</p>
        </div>

        <div className="card p-8">
          <form onSubmit={submit} className="space-y-4">
            {[
              { key: 'name',     label: 'Nome completo',      type: 'text',     placeholder: 'Seu nome' },
              { key: 'email',    label: 'E-mail',             type: 'email',    placeholder: 'seu@email.com' },
              { key: 'phone',    label: 'Telefone (opcional)',type: 'tel',      placeholder: '(11) 99999-9999' },
              { key: 'password', label: 'Senha',              type: 'password', placeholder: 'Mínimo 8 caracteres' },
              { key: 'password_confirmation', label: 'Confirmar senha', type: 'password', placeholder: 'Repita a senha' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-medium text-zinc-400 block mb-1.5">{label}</label>
                <input type={type} {...field(key)} className="input" placeholder={placeholder} required={key !== 'phone'} />
                {errors[key] && <p className="text-brand-400 text-xs mt-1">{errors[key][0]}</p>}
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
