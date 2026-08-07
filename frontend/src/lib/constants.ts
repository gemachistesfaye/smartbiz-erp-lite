export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    RESTORE: (id: string) => `/products/${id}/restore`,
    STATS: '/products/stats',
  },
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
    RESTORE: (id: string) => `/categories/${id}/restore`,
  },
  UNITS: {
    BASE: '/units',
    BY_ID: (id: string) => `/units/${id}`,
    RESTORE: (id: string) => `/units/${id}/restore`,
  },
  PRICING: {
    CALCULATE: '/pricing/calculate',
  },
  SUPPLIERS: {
    BASE: '/suppliers',
    BY_ID: (id: string) => `/suppliers/${id}`,
    RESTORE: (id: string) => `/suppliers/${id}/restore`,
    STATS: '/suppliers/stats',
    ACTIVE: '/suppliers/active',
  },
  INVENTORY: {
    BASE: '/inventory',
    BY_PRODUCT: (productId: string) => `/inventory/product/${productId}`,
    STATS: '/inventory/stats',
    LOW_STOCK: '/inventory/low-stock',
    OUT_OF_STOCK: '/inventory/out-of-stock',
  },
  STOCK: {
    RECEIVE: '/stock/receive',
    RECEIVE_LIST: '/stock/receive',
    RECEIVE_BY_ID: (id: string) => `/stock/receive/${id}`,
    CANCEL_RECEIVING: (id: string) => `/stock/receive/${id}/cancel`,
    ADJUST: '/stock/adjust',
  },
  INVENTORY_TRANSACTIONS: {
    BASE: '/inventory-transactions',
    STATS: '/inventory-transactions/stats',
    BY_PRODUCT: (productId: string) => `/inventory-transactions/product/${productId}`,
  },
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: (id: string) => `/customers/${id}`,
    RESTORE: (id: string) => `/customers/${id}/restore`,
    STATS: '/customers/stats',
    ACTIVE: '/customers/active',
    OVERDUE: '/customers/overdue',
    PAYMENTS: (id: string) => `/customers/${id}/payments`,
    CREDIT_HISTORY: (id: string) => `/customers/${id}/credit-history`,
    CAN_USE_CREDIT: (id: string, amount: number) => `/customers/${id}/can-use-credit?amount=${amount}`,
  },
  SALES: {
    BASE: '/sales',
    BY_ID: (id: string) => `/sales/${id}`,
    CHECKOUT: '/sales/checkout',
  },
  EXPENSES: {
    BASE: '/expenses',
    BY_ID: (id: string) => `/expenses/${id}`,
    CATEGORIES: '/expense-categories',
  },
  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    EXPENSES: '/reports/expenses',
    DASHBOARD: '/reports/dashboard',
  },
  HEALTH: '/health',
} as const;

export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'SmartBiz ERP Lite',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEFAULT_CURRENCY: 'ETB',
  CURRENCY_SYMBOL: 'Br',
  ITEMS_PER_PAGE: 20,
  DEBOUNCE_DELAY: 300,
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  SIDEBAR: 'sidebar',
} as const;

export const ROLES = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  CASHIER: 'Cashier',
};

export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'Units', href: '/units' },
  { name: 'Inventory', href: '/inventory' },
  { name: 'Suppliers', href: '/suppliers' },
  { name: 'Receive Stock', href: '/stock/receive' },
  { name: 'Customers', href: '/customers' },
  { name: 'Sales', href: '/sales' },
  { name: 'Expenses', href: '/expenses' },
  { name: 'Reports', href: '/reports' },
  { name: 'Settings', href: '/settings' },
  { name: 'Profile', href: '/profile' },
] as const;
