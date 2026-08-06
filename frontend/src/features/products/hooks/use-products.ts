import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Product, ProductStats, PricingBreakdown } from '@/types/models';

interface ProductListResponse {
  data: Product[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  unitId?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
      if (params?.unitId) searchParams.set('unitId', params.unitId);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}${qs ? `?${qs}` : ''}`);
      return response.data.data as ProductListResponse;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      return response.data.data as Product;
    },
    enabled: !!id,
  });
}

export function useProductStats() {
  return useQuery({
    queryKey: ['products', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.STATS);
      return response.data.data as ProductStats;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, data);
      return response.data.data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create product';
      toast.error(message);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.patch(API_ENDPOINTS.PRODUCTS.BY_ID(id), data);
      return response.data.data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update product';
      toast.error(message);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to delete product';
      toast.error(message);
    },
  });
}

export function useRestoreProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(API_ENDPOINTS.PRODUCTS.RESTORE(id));
      return response.data.data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product restored successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to restore product';
      toast.error(message);
    },
  });
}

export function useCalculatePricing() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.PRICING.CALCULATE, data);
      return response.data.data as PricingBreakdown;
    },
  });
}
