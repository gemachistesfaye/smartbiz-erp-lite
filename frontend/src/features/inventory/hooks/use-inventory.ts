import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  Inventory,
  InventoryStats,
  StockReceiving,
  InventoryTransaction,
  TransactionStats,
} from '@/types/models';

interface InventoryListResponse {
  data: Inventory[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface InventoryQueryParams {
  search?: string;
  stockStatus?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useInventoryList(params?: InventoryQueryParams) {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.stockStatus) searchParams.set('stockStatus', params.stockStatus);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.INVENTORY.BASE}${qs ? `?${qs}` : ''}`);
      return response.data.data as InventoryListResponse;
    },
  });
}

export function useInventoryByProduct(productId: string) {
  return useQuery({
    queryKey: ['inventory', 'product', productId],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.INVENTORY.BY_PRODUCT(productId));
      return response.data.data as Inventory;
    },
    enabled: !!productId,
  });
}

export function useInventoryStats() {
  return useQuery({
    queryKey: ['inventory', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.INVENTORY.STATS);
      return response.data.data as InventoryStats;
    },
  });
}

export function useLowStock() {
  return useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.INVENTORY.LOW_STOCK);
      return response.data.data as Inventory[];
    },
  });
}

export function useOutOfStock() {
  return useQuery({
    queryKey: ['inventory', 'out-of-stock'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.INVENTORY.OUT_OF_STOCK);
      return response.data.data as Inventory[];
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: any }) => {
      const response = await apiClient.patch(API_ENDPOINTS.INVENTORY.BY_PRODUCT(productId), data);
      return response.data.data as Inventory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update inventory';
      toast.error(message);
    },
  });
}

export function useStockReceivings(params?: { search?: string; status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['stock-receivings', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.STOCK.RECEIVE_LIST}${qs ? `?${qs}` : ''}`);
      return response.data.data as { data: StockReceiving[]; meta: any };
    },
  });
}

export function useStockReceiving(id: string) {
  return useQuery({
    queryKey: ['stock-receivings', id],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.STOCK.RECEIVE_BY_ID(id));
      return response.data.data as StockReceiving;
    },
    enabled: !!id,
  });
}

export function useReceiveStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.STOCK.RECEIVE, data);
      return response.data.data as StockReceiving;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-receivings'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Stock received successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to receive stock';
      toast.error(message);
    },
  });
}

export function useCancelReceiving() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(API_ENDPOINTS.STOCK.CANCEL_RECEIVING(id));
      return response.data.data as StockReceiving;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-receivings'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Stock receiving cancelled');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to cancel';
      toast.error(message);
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.STOCK.ADJUST, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      toast.success('Stock adjusted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to adjust stock';
      toast.error(message);
    },
  });
}

export function useInventoryTransactions(params?: {
  search?: string;
  type?: string;
  productId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['inventory-transactions', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.type) searchParams.set('type', params.type);
      if (params?.productId) searchParams.set('productId', params.productId);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.INVENTORY_TRANSACTIONS.BASE}${qs ? `?${qs}` : ''}`);
      return response.data.data as { data: InventoryTransaction[]; meta: any };
    },
  });
}

export function useTransactionStats() {
  return useQuery({
    queryKey: ['inventory-transactions', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.INVENTORY_TRANSACTIONS.STATS);
      return response.data.data as TransactionStats;
    },
  });
}
