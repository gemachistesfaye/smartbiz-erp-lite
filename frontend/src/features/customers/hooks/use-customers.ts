import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  Customer,
  CustomerDetails,
  CustomerStats,
  Payment,
  CreditHistory,
  CreditCheck,
} from '@/types/models';

interface CustomerListResponse {
  data: Customer[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface PaymentListResponse {
  data: Payment[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface CustomerQueryParams {
  search?: string;
  status?: string;
  hasBalance?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useCustomers(params?: CustomerQueryParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.hasBalance) searchParams.set('hasBalance', 'true');
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS.BASE}${qs ? `?${qs}` : ''}`);
      return response.data.data as CustomerListResponse;
    },
  });
}

export function useActiveCustomers() {
  return useQuery({
    queryKey: ['customers', 'active'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.ACTIVE);
      return response.data.data as Customer[];
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
      return response.data.data as CustomerDetails;
    },
    enabled: !!id,
  });
}

export function useCustomerStats() {
  return useQuery({
    queryKey: ['customers', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.STATS);
      return response.data.data as CustomerStats;
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.CUSTOMERS.BASE, data);
      return response.data.data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create customer';
      toast.error(message);
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.patch(API_ENDPOINTS.CUSTOMERS.BY_ID(id), data);
      return response.data.data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update customer';
      toast.error(message);
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to delete customer';
      toast.error(message);
    },
  });
}

export function useRestoreCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(API_ENDPOINTS.CUSTOMERS.RESTORE(id));
      return response.data.data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer restored successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to restore customer';
      toast.error(message);
    },
  });
}

export function useCustomerPayments(id: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['customers', id, 'payments', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.startDate) searchParams.set('startDate', params.startDate);
      if (params?.endDate) searchParams.set('endDate', params.endDate);
      const qs = searchParams.toString();
      const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS.PAYMENTS(id)}${qs ? `?${qs}` : ''}`);
      return response.data.data as PaymentListResponse;
    },
    enabled: !!id,
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ customerId, data }: { customerId: string; data: any }) => {
      const response = await apiClient.post(API_ENDPOINTS.CUSTOMERS.PAYMENTS(customerId), data);
      return response.data.data as Payment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers', variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.customerId, 'payments'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Payment recorded successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to record payment';
      toast.error(message);
    },
  });
}

export function useCustomerCreditHistory(id: string) {
  return useQuery({
    queryKey: ['customers', id, 'credit-history'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.CREDIT_HISTORY(id));
      return response.data.data as CreditHistory;
    },
    enabled: !!id,
  });
}

export function useCanUseCredit(customerId: string, amount: number, enabled = false) {
  return useQuery({
    queryKey: ['customers', customerId, 'can-use-credit', amount],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.CAN_USE_CREDIT(customerId, amount));
      return response.data.data as CreditCheck;
    },
    enabled: enabled && !!customerId && amount > 0,
  });
}
