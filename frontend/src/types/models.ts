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

export interface Category {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  _count?: { products: number };
}

export interface Unit {
  id: string;
  businessId: string;
  name: string;
  symbol: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Product {
  id: string;
  businessId: string;
  categoryId?: string;
  category?: { id: string; name: string; color?: string };
  unitId?: string;
  unit?: { id: string; name: string; symbol: string };
  name: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  description?: string;
  buyingPrice: number;
  quantityPurchased: number;
  transportationCost: number;
  loadingCost: number;
  packagingCost: number;
  storageCost: number;
  laborCost: number;
  customsCost: number;
  otherCosts: number;
  vatPercentage: number;
  profitPercentage: number;
  sellingPrice: number;
  manualSellingPrice: boolean;
  reorderLevel: number;
  maxStock?: number;
  status: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  images?: ProductImage[];
  inventory?: { quantity: number; minThreshold: number; maxThreshold?: number };
  pricing?: PricingBreakdown;
}

export interface PricingBreakdown {
  buyingPrice: number;
  quantityPurchased: number;
  totalAdditionalCosts: number;
  totalCost: number;
  costPerUnit: number;
  vatAmountPerUnit: number;
  profitAmountPerUnit: number;
  recommendedSellingPrice: number;
  expectedProfitPerUnit: number;
  expectedProfitPercentage: number;
  costBreakdown: {
    transportationCost: number;
    loadingCost: number;
    packagingCost: number;
    storageCost: number;
    laborCost: number;
    customsCost: number;
    otherCosts: number;
    subtotal: number;
  };
  explanation: string[];
}

export interface ProductStats {
  total: number;
  active: number;
  inactive: number;
}
