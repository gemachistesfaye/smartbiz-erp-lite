import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Customer } from '@/types/models';

export interface OverdueCustomer extends Customer {
  outstandingBalance: number;
  daysSinceLastCredit: number;
  lastCreditDate: string | null;
}

export function useOverdueCustomers() {
  return useQuery({
    queryKey: ['customers', 'overdue'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.OVERDUE);
      return response.data.data as OverdueCustomer[];
    },
  });
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  data: Notification[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export function useNotifications(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      const qs = searchParams.toString();
      const response = await apiClient.get(`/notifications${qs ? `?${qs}` : ''}`);
      return response.data.data as NotificationListResponse;
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await apiClient.get('/notifications/unread-count');
      return response.data.data as { count: number };
    },
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.patch('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useSendOverdueReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customerId: string) => {
      await apiClient.post(`/customers/${customerId}/send-reminder`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', 'overdue'] });
    },
  });
}
