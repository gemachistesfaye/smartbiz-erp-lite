import { useSyncStatus } from '@/hooks/use-sync-status';
import { cn } from '@/lib/utils';

export function ConnectivityStatus() {
  const { isOnline, syncStatus, pendingCount } = useSyncStatus();

  const getStatusDisplay = () => {
    if (!isOnline) {
      return { text: 'Offline', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' };
    }
    if (syncStatus === 'syncing') {
      return { text: 'Syncing...', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500 animate-pulse' };
    }
    if (syncStatus === 'error') {
      return { text: 'Sync issue', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' };
    }
    if (pendingCount > 0) {
      return { text: `${pendingCount} pending`, color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' };
    }
    return { text: 'Online', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
  };

  const status = getStatusDisplay();

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
        status.bg,
        status.color,
      )}
      title={
        !isOnline
          ? 'You are offline. Changes will sync when reconnected.'
          : syncStatus === 'syncing'
            ? 'Synchronizing pending changes...'
            : pendingCount > 0
              ? `${pendingCount} sale(s) pending sync`
              : 'Connected to server'
      }
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
      <span>{status.text}</span>
    </div>
  );
}
