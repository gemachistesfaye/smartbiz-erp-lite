import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Category, ApiResponse } from '@/types/models';

interface CategoryListResponse {
  data: Category[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface CategoryQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export function useCategories(params?: CategoryQueryParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.CATEGORIES.BASE}${qs ? `?${qs}` : ''}`);
      return response.data.data as CategoryListResponse;
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
      return response.data.data as Category;
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; color?: string; icon?: string }) => {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.BASE, data);
      return response.data.data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create category';
      toast.error(message);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; description?: string; color?: string; icon?: string; isActive?: boolean } }) => {
      const response = await apiClient.patch(API_ENDPOINTS.CATEGORIES.BY_ID(id), data);
      return response.data.data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update category';
      toast.error(message);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to delete category';
      toast.error(message);
    },
  });
}

export function useRestoreCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(API_ENDPOINTS.CATEGORIES.RESTORE(id));
      return response.data.data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category restored successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to restore category';
      toast.error(message);
    },
  });
}
