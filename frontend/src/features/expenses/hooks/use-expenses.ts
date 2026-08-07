import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface ExpenseCategory {
  id: string;
  businessId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { expenses: number };
}

export interface Expense {
  id: string;
  businessId: string;
  expenseNumber: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  receiptUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
  user: { id: string; firstName: string; lastName: string };
}

export interface ExpenseListResponse {
  data: Expense[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  summary: { totalAmount: number; count: number };
}

export interface ExpenseSummary {
  today: { total: number; count: number };
  thisMonth: { total: number; count: number };
}

export interface ExpenseQueryParams {
  search?: string;
  categoryId?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

function buildParams(params?: ExpenseQueryParams) {
  if (!params) return '';
  const sp = new URLSearchParams();
  if (params.search) sp.set('search', params.search);
  if (params.categoryId) sp.set('categoryId', params.categoryId);
  if (params.paymentMethod) sp.set('paymentMethod', params.paymentMethod);
  if (params.startDate) sp.set('startDate', params.startDate);
  if (params.endDate) sp.set('endDate', params.endDate);
  if (params.page) sp.set('page', String(params.page));
  if (params.limit) sp.set('limit', String(params.limit));
  if (params.sortBy) sp.set('sortBy', params.sortBy);
  if (params.sortOrder) sp.set('sortOrder', params.sortOrder);
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export function useExpenseCategories() {
  return useQuery<ExpenseCategory[]>({
    queryKey: ['expense-categories'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.EXPENSES.CATEGORIES);
      return response.data.data;
    },
  });
}

export function useCreateExpenseCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiClient.post(API_ENDPOINTS.EXPENSES.CATEGORIES, data);
      return response.data.data as ExpenseCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create category';
      toast.error(message);
    },
  });
}

export function useUpdateExpenseCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
      const response = await apiClient.patch(`${API_ENDPOINTS.EXPENSES.CATEGORIES}/${id}`, data);
      return response.data.data as ExpenseCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update category';
      toast.error(message);
    },
  });
}

export function useDeleteExpenseCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${API_ENDPOINTS.EXPENSES.CATEGORIES}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to delete category';
      toast.error(message);
    },
  });
}

export function useExpenses(params?: ExpenseQueryParams) {
  return useQuery<ExpenseListResponse>({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const qs = buildParams(params);
      const response = await apiClient.get(`${API_ENDPOINTS.EXPENSES.BASE}${qs}`);
      return response.data.data;
    },
  });
}

export function useExpense(id: string) {
  return useQuery<Expense>({
    queryKey: ['expenses', id],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.EXPENSES.BASE}/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useExpenseSummary() {
  return useQuery<ExpenseSummary>({
    queryKey: ['expenses', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get(`${API_ENDPOINTS.EXPENSES.BASE}/summary`);
      return response.data.data;
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.EXPENSES.BASE, data);
      return response.data.data as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports', 'dashboard'] });
      toast.success('Expense created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create expense';
      toast.error(message);
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.patch(`${API_ENDPOINTS.EXPENSES.BASE}/${id}`, data);
      return response.data.data as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports', 'dashboard'] });
      toast.success('Expense updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update expense';
      toast.error(message);
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${API_ENDPOINTS.EXPENSES.BASE}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports', 'dashboard'] });
      toast.success('Expense deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to delete expense';
      toast.error(message);
    },
  });
}
