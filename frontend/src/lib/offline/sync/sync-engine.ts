import { getPendingSales, updatePendingSale, deletePendingSale } from '../repositories/pending-sales';
import apiClient from '@/lib/api-client';
import type { PendingSale } from '../types';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

type SyncListener = (status: 'idle' | 'syncing' | 'error' | 'success', pendingCount: number) => void;

const listeners: Set<SyncListener> = new Set();
let currentStatus: 'idle' | 'syncing' | 'error' | 'success' = 'idle';
let syncInProgress = false;

export function onSyncStatusChange(listener: SyncListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners(status: typeof currentStatus, count: number) {
  currentStatus = status;
  listeners.forEach((l) => l(status, count));
}

export function getSyncStatus(): typeof currentStatus {
  return currentStatus;
}

async function syncSale(sale: PendingSale): Promise<boolean> {
  try {
    const payload = {
      paymentMethod: sale.paymentMethod,
      customerId: sale.customerId,
      discountAmount: sale.discountAmount,
      notes: sale.notes,
      items: sale.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      clientId: sale.id,
    };

    await apiClient.post('/sales', payload);
    return true;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: { error?: { code?: string; message?: string } } } };
    const status = err.response?.status;
    const code = err.response?.data?.error?.code;

    if (status === 409 || code === 'CONFLICT') {
      await updatePendingSale(sale.id, {
        status: 'CONFLICT',
        lastError: 'Duplicate sale detected on server',
      });
      return true;
    }

    if (status && status >= 400 && status < 500 && status !== 429) {
      await updatePendingSale(sale.id, {
        status: 'FAILED',
        lastError: err.response?.data?.error?.message || `Server error: ${status}`,
        retryCount: sale.retryCount + 1,
      });
      return true;
    }

    return false;
  }
}

export async function processSyncQueue(): Promise<void> {
  if (syncInProgress || !navigator.onLine) return;

  syncInProgress = true;
  notifyListeners('syncing', 0);

  try {
    const pending = await getPendingSales();
    const toSync = pending.filter(
      (s) => s.status === 'PENDING' || (s.status === 'FAILED' && s.retryCount < MAX_RETRIES),
    );

    if (toSync.length === 0) {
      notifyListeners('idle', 0);
      syncInProgress = false;
      return;
    }

    notifyListeners('syncing', toSync.length);

    let successCount = 0;
    let failCount = 0;

    for (const sale of toSync) {
      if (!navigator.onLine) break;

      await updatePendingSale(sale.id, { status: 'SYNCING' });

      const success = await syncSale(sale);
      if (success) {
        await deletePendingSale(sale.id);
        successCount++;
      } else {
        await updatePendingSale(sale.id, {
          status: 'FAILED',
          retryCount: sale.retryCount + 1,
          lastError: 'Network error - will retry',
        });
        failCount++;
      }

      if (toSync.indexOf(sale) < toSync.length - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }

    const remaining = await getPendingSales();
    notifyListeners(
      failCount > 0 ? 'error' : 'success',
      remaining.length,
    );
  } finally {
    syncInProgress = false;
  }
}

let syncInterval: ReturnType<typeof setInterval> | null = null;

export function startAutoSync(intervalMs = 30000): void {
  stopAutoSync();
  syncInterval = setInterval(() => {
    if (navigator.onLine) {
      processSyncQueue();
    }
  }, intervalMs);
}

export function stopAutoSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

export async function triggerSync(): Promise<void> {
  if (navigator.onLine) {
    await processSyncQueue();
  }
}
