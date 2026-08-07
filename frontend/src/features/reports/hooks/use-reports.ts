import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface ReportFilters {
  range?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  categoryId?: string;
  customerId?: string;
}

export interface OverviewData {
  periodRevenue: number;
  periodSaleCount: number;
  monthlyRevenue: number;
  revenueTrend: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalCustomers: number;
  outstandingCredit: number;
  totalExpenses: number;
  estimatedProfit: number;
}

export interface SalesReportData {
  summary: {
    totalRevenue: number;
    totalSales: number;
    averageSale: number;
    cashSales: number;
    creditSales: number;
  };
  salesTrend: Array<{ date: string; revenue: number; sales: number }>;
  paymentBreakdown: Array<{ method: string; totalRevenue: number; count: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    category: string;
    quantitySold: number;
    revenue: number;
    percentageOfSales: number;
  }>;
  categoryBreakdown: Array<{
    name: string;
    quantity: number;
    revenue: number;
    percentage: number;
  }>;
}

export interface InventoryReportData {
  summary: {
    totalProducts: number;
    totalStockQuantity: number;
    totalValue: number | null;
    lowStockProducts: number;
    outOfStockProducts: number;
    hasReliableCost: boolean;
  };
  products: Array<{
    id: string;
    productId: string;
    name: string;
    sku: string | null;
    category: string;
    currentStock: number;
    minimumStock: number;
    maximumStock: number | null;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
    unitCost: number;
    inventoryValue: number;
  }>;
}

export interface CustomerCreditData {
  summary: {
    totalOutstanding: number;
    customerCount: number;
    approachingLimit: number;
    exceededLimit: number;
  };
  customers: Array<{
    id: string;
    name: string;
    phone: string | null;
    creditLimit: number | null;
    outstanding: number;
    availableCredit: number | null;
    status: 'healthy' | 'approaching_limit' | 'exceeded_limit';
  }>;
}

export interface ExpenseReportData {
  available: boolean;
  summary: { totalExpenses: number; expenseCount: number };
  byCategory: Array<{ id: string; name: string; totalAmount: number; count: number }>;
  byDate: Array<{ date: string; amount: number }>;
}

export interface ProfitabilityData {
  revenue: number;
  expenses: number;
  estimatedProfit: number;
  hasExpenseData: boolean;
}

function buildQueryParams(filters: ReportFilters) {
  const params = new URLSearchParams();
  if (filters.range) params.set('range', filters.range);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.paymentMethod) params.set('paymentMethod', filters.paymentMethod);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.customerId) params.set('customerId', filters.customerId);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function useOverviewReport(filters: ReportFilters = {}) {
  return useQuery<OverviewData>({
    queryKey: ['reports', 'overview', filters],
    queryFn: async () => {
      const qs = buildQueryParams(filters);
      const response = await apiClient.get(`${API_ENDPOINTS.REPORTS.OVERVIEW}${qs}`);
      return response.data.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useSalesReport(filters: ReportFilters = {}) {
  return useQuery<SalesReportData>({
    queryKey: ['reports', 'sales', filters],
    queryFn: async () => {
      const qs = buildQueryParams(filters);
      const response = await apiClient.get(`${API_ENDPOINTS.REPORTS.SALES}${qs}`);
      return response.data.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useInventoryReport() {
  return useQuery<InventoryReportData>({
    queryKey: ['reports', 'inventory'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.REPORTS.INVENTORY);
      return response.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useCustomerCreditReport() {
  return useQuery<CustomerCreditData>({
    queryKey: ['reports', 'customers-credit'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.REPORTS.CUSTOMERS_CREDIT);
      return response.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useExpenseReport(filters: ReportFilters = {}) {
  return useQuery<ExpenseReportData>({
    queryKey: ['reports', 'expenses', filters],
    queryFn: async () => {
      const qs = buildQueryParams(filters);
      const response = await apiClient.get(`${API_ENDPOINTS.REPORTS.EXPENSES}${qs}`);
      return response.data.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useProfitability(filters: ReportFilters = {}) {
  return useQuery<ProfitabilityData>({
    queryKey: ['reports', 'profitability', filters],
    queryFn: async () => {
      const qs = buildQueryParams(filters);
      const response = await apiClient.get(`${API_ENDPOINTS.REPORTS.PROFITABILITY}${qs}`);
      return response.data.data;
    },
    staleTime: 30 * 1000,
  });
}
