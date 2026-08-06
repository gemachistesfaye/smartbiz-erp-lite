import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Supplier, SupplierStats } from '@/types/models';

interface SupplierListResponse {
  data: Supplier[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface SupplierQueryParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useSuppliers(params?: SupplierQueryParams) {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.SUPPLIERS.BASE}${qs ? `?${qs}` : ''}`);
      return response.data.data as SupplierListResponse;
    },
  });
}

export function useActiveSuppliers() {
  return useQuery({
    queryKey: ['suppliers', 'active'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SUPPLIERS.ACTIVE);
      return response.data.data as Supplier[];
    },
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
      return response.data.data as Supplier;
    },
    enabled: !!id,
  });
}

export function useSupplierStats() {
  return useQuery({
    queryKey: ['suppliers', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SUPPLIERS.STATS);
      return response.data.data as SupplierStats;
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.SUPPLIERS.BASE, data);
      return response.data.data as Supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create supplier';
      toast.error(message);
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.patch(API_ENDPOINTS.SUPPLIERS.BY_ID(id), data);
      return response.data.data as Supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update supplier';
      toast.error(message);
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to delete supplier';
      toast.error(message);
    },
  });
}

export function useRestoreSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(API_ENDPOINTS.SUPPLIERS.RESTORE(id));
      return response.data.data as Supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier restored successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to restore supplier';
      toast.error(message);
    },
  });
}
