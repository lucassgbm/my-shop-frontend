'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addressesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user }   = useAuthStore();
  const router     = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm,  setShowForm]  = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', zipcode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    addressesApi.list().then((r) => setAddresses(r.data));
  }, [user]);

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await addressesApi.create(form);
      setAddresses([...addresses, r.data]);
      setShowForm(false);
      setForm({ name: '', phone: '', zipcode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' });
      toast.success('Endereço adicionado!');
    } catch { toast.error('Erro ao salvar endereço'); }
    finally { setSaving(false); }
  };

  const deleteAddress = async (id: number) => {
    if (!confirm('Remover este endereço?')) return;
    await addressesApi.destroy(id);
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success('Endereço removido');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Dados do usuário */}
      <div className="card p-6">
        <h1 className="font-semibold text-white text-xl mb-4">Meu perfil</h1>
        <div className="space-y-1 text-sm text-zinc-400">
          <p><span className="text-zinc-500">Nome:</span> <span className="text-white">{user?.name}</span></p>
          <p><span className="text-zinc-500">E-mail:</span> <span className="text-white">{user?.email}</span></p>
          {user?.phone && <p><span className="text-zinc-500">Telefone:</span> <span className="text-white">{user.phone}</span></p>}
        </div>
      </div>

      {/* Endereços */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white text-lg">Endereços</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn-outline text-sm px-4 py-2">
            {showForm ? 'Cancelar' : '+ Adicionar'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={saveAddress} className="card p-6 mb-4 grid grid-cols-2 gap-4 animate-fade-in">
            {[
              { key: 'name',         label: 'Nome do destinatário', cols: 2, req: true },
              { key: 'phone',        label: 'Telefone',             cols: 1, req: true },
              { key: 'zipcode',      label: 'CEP',                  cols: 1, req: true },
              { key: 'street',       label: 'Rua',                  cols: 2, req: true },
              { key: 'number',       label: 'Número',               cols: 1, req: true },
              { key: 'complement',   label: 'Complemento',          cols: 1, req: false },
              { key: 'neighborhood', label: 'Bairro',               cols: 2, req: true },
              { key: 'city',         label: 'Cidade',               cols: 1, req: true },
              { key: 'state',        label: 'Estado (UF)',          cols: 1, req: true },
            ].map(({ key, label, cols, req }) => (
              <div key={key} className={cols === 2 ? 'col-span-2' : ''}>
                <label className="text-xs text-zinc-400 block mb-1">{label}</label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input text-sm" required={req}
                  maxLength={key === 'state' ? 2 : undefined}
                />
              </div>
            ))}
            <div className="col-span-2">
              <button type="submit" disabled={saving} className="btn-primary w-full py-3">
                {saving ? 'Salvando...' : 'Salvar endereço'}
              </button>
            </div>
          </form>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="card p-8 text-center text-zinc-600">
            <p>Nenhum endereço cadastrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div key={a.id} className="card p-4 flex items-start justify-between gap-4">
                <div className="text-sm">
                  <p className="font-medium text-white">{a.name}</p>
                  <p className="text-zinc-400">{a.street}, {a.number} {a.complement ? `— ${a.complement}` : ''}</p>
                  <p className="text-zinc-500">{a.neighborhood} · {a.city}/{a.state} · CEP {a.zipcode}</p>
                </div>
                <button onClick={() => deleteAddress(a.id)} className="text-zinc-600 hover:text-red-400 transition-colors text-xs shrink-0">Remover</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
