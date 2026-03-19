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
        localStorage.setItem('token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
      },
      isAdmin: () => get().user?.roles?.includes('admin') ?? false,
    }),
    { name: 'auth-store', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);

// ── Cart Store ────────────────────────────────────────────────────
interface CartItem {
  key: string;
  product_id: number;
  variant_id?: number;
  name: string;
  size?: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartSummary {
  items: CartItem[];
  coupon: { code: string; type: string; value: number } | null;
  subtotal: number;
  discount: number;
  total: number;
  count: number;
}

interface CartStore {
  cart: CartSummary;
  setCart: (cart: CartSummary) => void;
  clearCart: () => void;
}

const emptyCart: CartSummary = { items: [], coupon: null, subtotal: 0, discount: 0, total: 0, count: 0 };

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: emptyCart,
      setCart:  (cart) => set({ cart }),
      clearCart: () => set({ cart: emptyCart }),
    }),
    { name: 'cart-store' }
  )
);
