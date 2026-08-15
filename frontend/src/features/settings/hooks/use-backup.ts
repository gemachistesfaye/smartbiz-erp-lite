import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface ImportSummary {
  products?: number;
  categories?: number;
  customers?: number;
  sales?: number;
  expenses?: number;
}

export function useExportBackup() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.BACKUP.EXPORT, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `smartbiz-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
  });
}

export function useImportBackup() {
  return useMutation({
    mutationFn: async (file: File) => {
      const text = await file.text();
      const data = JSON.parse(text);
      const response = await apiClient.post(API_ENDPOINTS.BACKUP.IMPORT, { data });
      return response.data.data as ImportSummary;
    },
  });
}
