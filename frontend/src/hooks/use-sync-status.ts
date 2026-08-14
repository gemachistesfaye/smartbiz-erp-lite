import { useEffect, useState, useCallback } from 'react';
import {
  onSyncStatusChange,
  triggerSync,
  getSyncStatus,
  getPendingSaleCount,
} from '@/lib/offline';
import { useOnlineStatus } from './use-online-status';

export interface SyncState {
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  pendingCount: number;
  triggerSync: () => Promise<void>;
}

export function useSyncStatus(): SyncState {
  const isOnline = useOnlineStatus();
  const [syncStatus, setSyncStatus] = useState<typeof getSyncStatus extends () => infer R ? R : 'idle'>(getSyncStatus());
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const unsub = onSyncStatusChange(async (status, count) => {
      setSyncStatus(status);
      setPendingCount(count);
    });

    getPendingSaleCount().then(setPendingCount);

    return unsub;
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount > 0 && syncStatus !== 'syncing') {
      triggerSync();
    }
  }, [isOnline, pendingCount, syncStatus]);

  const handleTriggerSync = useCallback(async () => {
    if (isOnline) {
      await triggerSync();
      const count = await getPendingSaleCount();
      setPendingCount(count);
    }
  }, [isOnline]);

  return {
    isOnline,
    syncStatus,
    pendingCount,
    triggerSync: handleTriggerSync,
  };
}
