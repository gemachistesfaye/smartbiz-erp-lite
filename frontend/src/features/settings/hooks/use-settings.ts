import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface BusinessSettings {
  id: string;
  businessId: string;
  taxRate: number;
  currency: string;
  currencySymbol: string;
  lowStockThreshold: number;
  tinNumber: string | null;
  vatNumber: string | null;
  receiptHeader: string | null;
  receiptFooter: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessInfo {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export function useSettings() {
  return useQuery<BusinessSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SETTINGS.BASE);
      return response.data.data;
    },
  });
}

export function useBusinessInfo() {
  return useQuery<BusinessInfo>({
    queryKey: ['settings', 'business'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SETTINGS.BUSINESS);
      return response.data.data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<BusinessSettings>) => {
      const response = await apiClient.patch(API_ENDPOINTS.SETTINGS.BASE, data);
      return response.data.data as BusinessSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to save settings';
      toast.error(message);
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<BusinessInfo>) => {
      const response = await apiClient.patch(API_ENDPOINTS.SETTINGS.BUSINESS, data);
      return response.data.data as BusinessInfo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Business information saved successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to save business information';
      toast.error(message);
    },
  });
}
