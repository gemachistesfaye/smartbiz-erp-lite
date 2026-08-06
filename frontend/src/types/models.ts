export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'MANAGER' | 'CASHIER';
  isActive: boolean;
  businessId: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  address?: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
