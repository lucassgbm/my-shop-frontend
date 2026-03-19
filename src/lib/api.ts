import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// Injeta token automaticamente
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redireciona para login em 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login:    (data: any) => api.post('/auth/login', data),
  logout:   ()          => api.post('/auth/logout'),
  me:       ()          => api.get('/auth/me'),
};

// ── Produtos ──────────────────────────────────────────────────────
export const productsApi = {
  list:     (params?: any) => api.get('/products', { params }),
  featured: ()             => api.get('/products/featured'),
  show:     (slug: string) => api.get(`/products/${slug}`),
};

// ── Categorias ────────────────────────────────────────────────────
export const categoriesApi = {
  list: ()             => api.get('/categories'),
  show: (slug: string) => api.get(`/categories/${slug}`),
};

// ── Carrinho (stateless — gerenciado pelo Zustand) ───────────────
export const cartApi = {
  // Valida e recalcula o carrinho no servidor
  sync:    (items: any[], coupon_code?: string) =>
    api.post('/cart/summary', { items, coupon_code }),
};

// ── Checkout ──────────────────────────────────────────────────────
export const checkoutApi = {
  pix:  (data: any) => api.post('/checkout/pix', data),
  card: (data: any) => api.post('/checkout/card', data),
};

// ── Pedidos ───────────────────────────────────────────────────────
export const ordersApi = {
  list: (params?: any)  => api.get('/orders', { params }),
  show: (id: number)    => api.get(`/orders/${id}`),
};

// ── Endereços ─────────────────────────────────────────────────────
export const addressesApi = {
  list:    ()             => api.get('/addresses'),
  create:  (data: any)   => api.post('/addresses', data),
  update:  (id: number, data: any) => api.put(`/addresses/${id}`, data),
  destroy: (id: number)  => api.delete(`/addresses/${id}`),
};

// ── Wishlist ──────────────────────────────────────────────────────
export const wishlistApi = {
  list:   ()               => api.get('/wishlist'),
  toggle: (productId: number) => api.post(`/wishlist/${productId}`),
};

// ── Frete e Cupom ─────────────────────────────────────────────────
export const shippingApi = {
  calculate: (cep: string, items: any[]) => api.post('/shipping/calculate', { cep, items }),
};

export const couponApi = {
  validate: (code: string, subtotal: number) =>
    api.post('/cart/coupon/validate', { code, subtotal }),
};
