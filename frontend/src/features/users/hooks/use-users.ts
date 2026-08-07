import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { User } from '@/types/models';

interface UserListResponse {
  data: User[];
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS.BASE);
      return response.data.data as UserListResponse;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
      return response.data.data as User;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: 'OWNER' | 'MANAGER' | 'CASHIER';
      phone?: string;
    }) => {
      const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, data);
      return response.data.data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to create user';
      toast.error(message);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { firstName?: string; lastName?: string; role?: string; phone?: string; isActive?: boolean } }) => {
      const response = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), data);
      return response.data.data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update user';
      toast.error(message);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string }) => {
      const user = queryClient.getQueryData<{ id: string }>(['auth', 'me']);
      if (!user) throw new Error('Not authenticated');
      const response = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(user.id), data);
      return response.data.data as User;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Profile updated successfully');
      return data;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({ id, currentPassword, newPassword }: { id: string; currentPassword: string; newPassword: string }) => {
      const response = await apiClient.put(`${API_ENDPOINTS.USERS.BY_ID(id)}/change-password`, {
        currentPassword,
        newPassword,
      });
      return response.data.data as { message: string };
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to change password';
      toast.error(message);
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.put(`${API_ENDPOINTS.USERS.BY_ID(id)}/deactivate`);
      return response.data.data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deactivated');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to deactivate user';
      toast.error(message);
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.put(`${API_ENDPOINTS.USERS.BY_ID(id)}/activate`);
      return response.data.data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User activated');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to activate user';
      toast.error(message);
    },
  });
}
