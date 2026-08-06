import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Unit } from '@/types/models';

interface UnitListResponse {
  data: Unit[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface UnitQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export function useUnits(params?: UnitQueryParams) {
  return useQuery({
    queryKey: ['units', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.UNITS.BASE}${qs ? `?${qs}` : ''}`);
      return response.data.data as UnitListResponse;
    },
  });
}

export function useAllUnits() {
  return useQuery({
    queryKey: ['units', 'all'],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.UNITS.BASE}?limit=100`);
      const result = response.data.data as UnitListResponse;
      return result.data;
    },
  });
}

export function useUnit(id: string) {
  return useQuery({
    queryKey: ['units', id],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.UNITS.BY_ID(id));
      return response.data.data as Unit;
    },
    enabled: !!id,
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; symbol: string; description?: string }) => {
      const response = await apiClient.post(API_ENDPOINTS.UNITS.BASE, data);
      return response.data.data as Unit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unit created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create unit';
      toast.error(message);
    },
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; symbol?: string; description?: string; isActive?: boolean } }) => {
      const response = await apiClient.patch(API_ENDPOINTS.UNITS.BY_ID(id), data);
      return response.data.data as Unit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unit updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update unit';
      toast.error(message);
    },
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.UNITS.BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unit deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to delete unit';
      toast.error(message);
    },
  });
}

export function useRestoreUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(API_ENDPOINTS.UNITS.RESTORE(id));
      return response.data.data as Unit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unit restored successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to restore unit';
      toast.error(message);
    },
  });
}
