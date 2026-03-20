import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Auth Store ────────────────────────────────────────────────────
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:  null,
      token: null,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') localStorage.setItem('token', token);
        set({ user, token });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ user: null, token: null });
      },
      isAdmin: () => get().user?.roles?.includes('admin') ?? false,
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({ user: s.user, token: s.token }),
      // Ao rehidratar do localStorage, sincroniza o token
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof window !== 'undefined') {
          localStorage.setItem('token', state.token);
        }
      },
    }
  )
);

// ── Cart Store ────────────────────────────────────────────────────
export interface CartItem {
  key: string;
  product_id: number;
  variant_id?: number | null;
  name: string;
  size?: string | null;
  image: string;
  price: number;
  quantity: number;
}

interface Coupon {
  id: number;
  code: string;
  type: string;
  value: number;
}

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;

  // Computed
  subtotal: () => number;
  discount: () => number;
  total: () => number;
  count: () => number;

  // Actions
  addItem: (item: Omit<CartItem, 'key'> & { key?: string }) => void;
  updateItem: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  setCoupon: (coupon: Coupon | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:  [],
      coupon: null,

      subtotal: () => get().items.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
      discount: () => {
        const c = get().coupon;
        if (!c) return 0;
        const sub = get().subtotal();
        return c.type === 'percent'
          ? Math.round(sub * (c.value / 100) * 100) / 100
          : Math.min(c.value, sub);
      },
      total: () => Math.max(0, get().subtotal() - get().discount()),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),

      addItem: (newItem) => {
        const key = newItem.key || `${newItem.product_id}-${newItem.variant_id ?? '0'}`;
        // Garante que price seja sempre number
        const item = { ...newItem, key, price: Number(newItem.price) };
        set((state) => {
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      updateItem: (key, quantity) => {
        if (quantity <= 0) {
          set((state) => ({ items: state.items.filter((i) => i.key !== key) }));
        } else {
          set((state) => ({
            items: state.items.map((i) => (i.key === key ? { ...i, quantity } : i)),
          }));
        }
      },

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      setCoupon: (coupon) => set({ coupon }),

      clearCart: () => set({ items: [], coupon: null }),
    }),
    {
      name: 'cart-store',
      // Migração: garante que price sempre seja number ao carregar do storage
      onRehydrateStorage: () => (state) => {
        if (state?.items) {
          state.items = state.items.map((i) => ({ ...i, price: Number(i.price) }));
        }
      },
    }
  )
);
