import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Sale } from '@/types/models';

interface SaleListResponse {
  data: Sale[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface SaleQueryParams {
  search?: string;
  paymentMethod?: string;
  status?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export function useSales(params?: SaleQueryParams) {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.paymentMethod) searchParams.set('paymentMethod', params.paymentMethod);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.customerId) searchParams.set('customerId', params.customerId);
      if (params?.startDate) searchParams.set('startDate', params.startDate);
      if (params?.endDate) searchParams.set('endDate', params.endDate);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.SALES.BASE}${qs ? `?${qs}` : ''}`);
      return response.data.data as SaleListResponse;
    },
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SALES.BY_ID(id));
      return response.data.data as Sale;
    },
    enabled: !!id,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.SALES.BASE, data);
      return response.data.data as Sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Sale completed successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create sale';
      toast.error(message);
    },
  });
}

export function useCancelSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(API_ENDPOINTS.SALES.CANCEL(id));
      return response.data.data as Sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Sale cancelled successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to cancel sale';
      toast.error(message);
    },
  });
}
