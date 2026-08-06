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
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: (id: string) => `/customers/${id}`,
  },
  SALES: {
    BASE: '/sales',
    BY_ID: (id: string) => `/sales/${id}`,
    CHECKOUT: '/sales/checkout',
  },
  INVENTORY: {
    BASE: '/inventory',
    TRANSACTIONS: '/inventory/transactions',
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
  { name: 'Customers', href: '/customers' },
  { name: 'Sales', href: '/sales' },
  { name: 'Expenses', href: '/expenses' },
  { name: 'Reports', href: '/reports' },
  { name: 'Settings', href: '/settings' },
  { name: 'Profile', href: '/profile' },
] as const;
