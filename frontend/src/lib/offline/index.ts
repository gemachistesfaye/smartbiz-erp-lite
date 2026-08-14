export { getDB, clearAllData } from './db';
export type { SmartBizDB } from './db';
export type {
  CachedProduct,
  CachedCategory,
  CachedUnit,
  CachedCustomer,
  CachedInventory,
  PendingSale,
  SyncQueueItem,
  SyncStatus,
} from './types';
export {
  createPendingSale,
  getPendingSales,
  getPendingSale,
  updatePendingSale,
  deletePendingSale,
  getPendingSaleCount,
} from './repositories/pending-sales';
export {
  cacheProducts,
  cacheCategories,
  cacheUnits,
  cacheCustomers,
  cacheInventory,
  shouldRefreshCache,
} from './sync/cache-service';
export {
  processSyncQueue,
  startAutoSync,
  stopAutoSync,
  triggerSync,
  onSyncStatusChange,
  getSyncStatus,
} from './sync/sync-engine';
export {
  getAll,
  getById,
  putOne,
  putMany,
  getByIndex,
} from './repositories/cache-helpers';
