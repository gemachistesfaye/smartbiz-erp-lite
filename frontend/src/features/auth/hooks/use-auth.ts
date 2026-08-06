import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import { useAuthStore } from '../store/auth-store';
import type { User } from '@/types/models';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  businessName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
      return response.data.data as AuthResponse;
    },
    onSuccess: async (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      await navigate({ to: '/dashboard', replace: true });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
      return response.data.data as AuthResponse;
    },
    onSuccess: async (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      await navigate({ to: '/dashboard', replace: true });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    },
    onSettled: async () => {
      logout();
      await navigate({ to: '/login', replace: true });
    },
  });
}

export function useCurrentUser() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response.data.data as User;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useRefreshUser() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };
}
