export interface CachedProduct {
  id: string;
  businessId: string;
  name: string;
  sku?: string;
  barcode?: string;
  sellingPrice: number;
  buyingPrice: number;
  categoryId?: string;
  unitId?: string;
  status: string;
  isActive: boolean;
  reorderLevel: number;
  maxStock?: number;
  updatedAt: string;
}

export interface CachedCategory {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface CachedUnit {
  id: string;
  businessId: string;
  name: string;
  symbol: string;
  description?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface CachedCustomer {
  id: string;
  businessId: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  creditBalance: number;
  creditLimit?: number;
  status: string;
  notes?: string;
  updatedAt: string;
}

export interface CachedInventory {
  id: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  minThreshold: number;
  maxThreshold?: number;
  averageCost: number;
  inventoryValue: number;
  lastUpdated: string;
  updatedAt: string;
}

export interface PendingSale {
  id: string;
  businessId: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CREDIT';
  customerId?: string;
  customerName?: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';
  createdAt: string;
  syncedAt?: string;
  retryCount: number;
  lastError?: string;
  localSaleNumber: string;
}

export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';

export interface SyncQueueItem {
  id: string;
  type: 'SALE' | 'CUSTOMER_PAYMENT' | 'STOCK_ADJUSTMENT';
  payload: unknown;
  status: SyncStatus;
  createdAt: string;
  syncedAt?: string;
  retryCount: number;
  lastError?: string;
  clientId: string;
}

export interface OfflineMetadata {
  key: string;
  lastSyncedAt: string;
  businessId: string;
}
