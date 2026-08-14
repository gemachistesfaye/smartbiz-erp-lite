import { putMany, setLastSyncTime, getLastSyncTime } from '../repositories/cache-helpers';
import type {
  CachedProduct,
  CachedCategory,
  CachedUnit,
  CachedCustomer,
  CachedInventory,
} from '../types';

const CACHE_MAX_AGE_MS = 5 * 60 * 1000;

async function isStale(store: string): Promise<boolean> {
  const lastSync = await getLastSyncTime(store);
  if (!lastSync) return true;
  return Date.now() - new Date(lastSync).getTime() > CACHE_MAX_AGE_MS;
}

export async function cacheProducts(products: CachedProduct[]): Promise<void> {
  await putMany('products', products);
  await setLastSyncTime('products', new Date().toISOString());
}

export async function cacheCategories(categories: CachedCategory[]): Promise<void> {
  await putMany('categories', categories);
  await setLastSyncTime('categories', new Date().toISOString());
}

export async function cacheUnits(units: CachedUnit[]): Promise<void> {
  await putMany('units', units);
  await setLastSyncTime('units', new Date().toISOString());
}

export async function cacheCustomers(customers: CachedCustomer[]): Promise<void> {
  await putMany('customers', customers);
  await setLastSyncTime('customers', new Date().toISOString());
}

export async function cacheInventory(inventory: CachedInventory[]): Promise<void> {
  await putMany('inventory', inventory);
  await setLastSyncTime('inventory', new Date().toISOString());
}

export async function shouldRefreshCache(store: string): Promise<boolean> {
  return isStale(store);
}
