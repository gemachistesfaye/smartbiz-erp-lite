import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  CachedProduct,
  CachedCategory,
  CachedUnit,
  CachedCustomer,
  CachedInventory,
  PendingSale,
  SyncQueueItem,
  OfflineMetadata,
} from './types';

const DB_NAME = 'smartbiz-offline';
const DB_VERSION = 1;

export interface SmartBizDB extends DBSchema {
  products: {
    key: string;
    value: CachedProduct;
    indexes: { 'by-business': string; 'by-category': string };
  };
  categories: {
    key: string;
    value: CachedCategory;
    indexes: { 'by-business': string };
  };
  units: {
    key: string;
    value: CachedUnit;
    indexes: { 'by-business': string };
  };
  customers: {
    key: string;
    value: CachedCustomer;
    indexes: { 'by-business': string };
  };
  inventory: {
    key: string;
    value: CachedInventory;
    indexes: { 'by-product': string };
  };
  pendingSales: {
    key: string;
    value: PendingSale;
    indexes: { 'by-status': string; 'by-created': string };
  };
  syncQueue: {
    key: string;
    value: SyncQueueItem;
    indexes: { 'by-status': string };
  };
  metadata: {
    key: string;
    value: OfflineMetadata;
  };
}

let dbInstance: IDBPDatabase<SmartBizDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<SmartBizDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<SmartBizDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Products store
      const productStore = db.createObjectStore('products', { keyPath: 'id' });
      productStore.createIndex('by-business', 'businessId');
      productStore.createIndex('by-category', 'categoryId');

      // Categories store
      const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
      categoryStore.createIndex('by-business', 'businessId');

      // Units store
      const unitStore = db.createObjectStore('units', { keyPath: 'id' });
      unitStore.createIndex('by-business', 'businessId');

      // Customers store
      const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
      customerStore.createIndex('by-business', 'businessId');

      // Inventory store
      const inventoryStore = db.createObjectStore('inventory', { keyPath: 'id' });
      inventoryStore.createIndex('by-product', 'productId');

      // Pending sales (offline queue)
      const pendingSalesStore = db.createObjectStore('pendingSales', { keyPath: 'id' });
      pendingSalesStore.createIndex('by-status', 'status');
      pendingSalesStore.createIndex('by-created', 'createdAt');

      // Sync queue
      const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
      syncStore.createIndex('by-status', 'status');

      // Metadata (sync timestamps, etc.)
      db.createObjectStore('metadata', { keyPath: 'key' });
    },
  });

  return dbInstance;
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(
    ['products', 'categories', 'units', 'customers', 'inventory', 'pendingSales', 'syncQueue', 'metadata'],
    'readwrite',
  );
  await Promise.all([
    tx.objectStore('products').clear(),
    tx.objectStore('categories').clear(),
    tx.objectStore('units').clear(),
    tx.objectStore('customers').clear(),
    tx.objectStore('inventory').clear(),
    tx.objectStore('pendingSales').clear(),
    tx.objectStore('syncQueue').clear(),
    tx.objectStore('metadata').clear(),
    tx.done,
  ]);
}
