import { getDB } from '../db';

const SYNC_META_PREFIX = 'lastSynced:';

export async function getLastSyncTime(store: string): Promise<string | null> {
  const db = await getDB();
  const meta = await db.get('metadata', `${SYNC_META_PREFIX}${store}`);
  return meta?.lastSyncedAt ?? null;
}

export async function setLastSyncTime(store: string, timestamp: string): Promise<void> {
  const db = await getDB();
  await db.put('metadata', {
    key: `${SYNC_META_PREFIX}${store}`,
    lastSyncedAt: timestamp,
    businessId: '',
  });
}

export async function putMany<T extends { id: string }>(
  storeName: 'products' | 'categories' | 'units' | 'customers' | 'inventory',
  items: T[],
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  for (const item of items) {
    await store.put(item as any);
  }
  await tx.done;
}

export async function putOne<T extends { id: string }>(
  storeName: 'products' | 'categories' | 'units' | 'customers' | 'inventory',
  item: T,
): Promise<void> {
  const db = await getDB();
  await db.put(storeName, item as any);
}

export async function getAll<T>(
  storeName: 'products' | 'categories' | 'units' | 'customers' | 'inventory',
): Promise<T[]> {
  const db = await getDB();
  return db.getAll(storeName) as Promise<T[]>;
}

export async function getById<T>(
  storeName: 'products' | 'categories' | 'units' | 'customers' | 'inventory',
  id: string,
): Promise<T | undefined> {
  const db = await getDB();
  return db.get(storeName, id) as Promise<T | undefined>;
}

export async function deleteMany(
  storeName: 'products' | 'categories' | 'units' | 'customers' | 'inventory',
  ids: string[],
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  for (const id of ids) {
    await store.delete(id);
  }
  await tx.done;
}

export async function count(storeName: 'products' | 'categories' | 'units' | 'customers' | 'inventory'): Promise<number> {
  const db = await getDB();
  return db.count(storeName);
}

export async function getByIndex<T>(
  storeName: 'products' | 'categories' | 'units' | 'customers' | 'inventory',
  indexName: string,
  key: string,
): Promise<T[]> {
  const db = await getDB();
  return db.getAllFromIndex(storeName, indexName as never, key as unknown as IDBKeyRange) as Promise<T[]>;
}
