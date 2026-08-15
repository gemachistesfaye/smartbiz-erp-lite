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
  batchNumber?: string;
  expiryDate?: string;
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
  inventory?: Inventory;
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

export interface Supplier {
  id: string;
  businessId: string;
  name: string;
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  tin?: string;
  address?: string;
  city?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  _count?: { purchases: number; stockReceivings: number };
}

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  minThreshold: number;
  maxThreshold?: number;
  averageCost: number;
  inventoryValue: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    sku?: string;
    barcode?: string;
    reorderLevel: number;
    maxStock?: number;
    sellingPrice: number;
    buyingPrice: number;
    unit?: { name: string; symbol: string };
    category?: { name: string; color?: string };
  };
  availableQuantity?: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
}

export interface InventoryStats {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  overstock: number;
  totalValue: number;
}

export interface StockReceiving {
  id: string;
  businessId: string;
  supplierId?: string;
  supplier?: { id: string; name: string; companyName?: string; phone?: string; email?: string };
  purchaseReference?: string;
  date: string;
  subtotal: number;
  transportationCost: number;
  packagingCost: number;
  storageCost: number;
  laborCost: number;
  otherCosts: number;
  totalCost: number;
  notes?: string;
  status: 'DRAFT' | 'RECEIVED' | 'CANCELLED';
  userId: string;
  user?: { id: string; firstName: string; lastName: string };
  items: StockReceivingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StockReceivingItem {
  id: string;
  stockReceivingId: string;
  productId: string;
  product?: { id: string; name: string; sku?: string; unit?: { symbol: string } };
  quantity: number;
  buyingPrice: number;
  totalCost: number;
}

export interface StockAdjustment {
  id: string;
  businessId: string;
  productId: string;
  product?: { id: string; name: string; sku?: string };
  type: 'ADJUSTMENT' | 'DAMAGE' | 'LOSS' | 'CORRECTION';
  quantity: number;
  reason: string;
  notes?: string;
  userId: string;
  user?: { id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  businessId: string;
  productId: string;
  product?: { id: string; name: string; sku?: string; unit?: { name: string; symbol: string } };
  type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'TRANSFER' | 'RETURN' | 'DAMAGE' | 'LOSS' | 'CORRECTION';
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceId?: string;
  referenceType?: string;
  reason?: string;
  userId: string;
  user?: { id: string; firstName: string; lastName: string };
  createdAt: string;
}

export interface TransactionStats {
  todayTransactions: number;
  monthTransactions: number;
  byType: Record<string, number>;
}

export interface Customer {
  id: string;
  businessId: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  creditBalance: number;
  creditLimit?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CustomerDetails extends Customer {
  totalCredit: number;
  totalPaid: number;
  outstandingBalance: number;
  availableCredit: number | null;
  lastPaymentDate: string | null;
  totalPurchases: number;
  totalPurchaseAmount: number;
  lastPurchaseDate: string | null;
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  withBalance: number;
}

export interface Payment {
  id: string;
  businessId: string;
  customerId?: string;
  saleId?: string;
  type: 'INCOMING' | 'OUTGOING';
  method: 'CASH' | 'MOBILE_MONEY' | 'CREDIT';
  amount: number;
  reference?: string;
  notes?: string;
  userId: string;
  user?: { id: string; firstName: string; lastName: string };
  createdAt: string;
}

export interface CreditHistoryActivity {
  id: string;
  type: 'CREDIT_SALE' | 'PAYMENT';
  amount: number;
  date: string;
  description: string;
  status?: string;
  reference?: string;
}

export interface CreditHistory {
  activities: CreditHistoryActivity[];
  currentBalance: number;
}

export interface CreditCheck {
  allowed: boolean;
  currentBalance: number;
  creditLimit: number | null;
  availableCredit: number | null;
  requestedAmount: number;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product?: { id: string; name: string; sku?: string; unit?: { symbol: string } };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  businessId: string;
  cashierId: string;
  cashier?: { id: string; firstName: string; lastName: string };
  customerId?: string;
  customer?: { id: string; firstName: string; lastName?: string; phone?: string };
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CREDIT';
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountTendered?: number;
  changeAmount?: number;
  status: 'COMPLETED' | 'VOIDED' | 'REFUNDED';
  notes?: string;
  dueDate?: string;
  items: SaleItem[];
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface SaleStats {
  totalSales: number;
  totalRevenue: number;
  todaySales: number;
  todayRevenue: number;
}
