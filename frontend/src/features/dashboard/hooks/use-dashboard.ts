import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface DashboardOverview {
  todaySales: number;
  todaySaleCount: number;
  monthlyRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  outstandingCredit: number;
  totalExpenses: number;
  estimatedProfit: number;
  revenueTrend: number;
}

export interface SalesTrendPoint {
  date: string;
  day: string;
  sales: number;
  expenses: number;
}

export interface RecentSale {
  id: string;
  customer: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
}

export interface InventoryCategory {
  name: string;
  productCount: number;
  totalStock: number;
}

export interface CustomerCreditSummary {
  totalOutstanding: number;
  customerCount: number;
  topCustomers: Array<{
    id: string;
    name: string;
    balance: number;
    limit: number | null;
  }>;
}

export interface ActivityFeedItem {
  id: string;
  action: string;
  target: string;
  time: string;
  type: 'sale' | 'product' | 'customer' | 'stock' | 'expense';
}

export interface DashboardData {
  overview: DashboardOverview;
  salesTrend: SalesTrendPoint[];
  recentSales: RecentSale[];
  topSellingProducts: TopProduct[];
  inventorySummary: InventoryCategory[];
  customerCreditSummary: CustomerCreditSummary;
  activityFeed: ActivityFeedItem[];
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['reports', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.REPORTS.DASHBOARD);
      return response.data.data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}
