import { getDB } from '../db';
import type { PendingSale, SyncStatus } from '../types';

function generateClientId(): string {
  return `offline-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateLocalSaleNumber(): string {
  const d = new Date();
  const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
  const seq = Math.floor(Math.random() * 9000 + 1000);
  return `SB-LOCAL-${dateStr}-${seq}`;
}

export async function createPendingSale(
  sale: Omit<PendingSale, 'id' | 'status' | 'createdAt' | 'retryCount' | 'localSaleNumber' | 'clientId'>,
): Promise<PendingSale> {
  const db = await getDB();
  const pending: PendingSale = {
    ...sale,
    id: generateClientId(),
    localSaleNumber: generateLocalSaleNumber(),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    retryCount: 0,
  };
  await db.put('pendingSales', pending);
  return pending;
}

export async function getPendingSales(): Promise<PendingSale[]> {
  const db = await getDB();
  return db.getAll('pendingSales');
}

export async function getPendingSalesByStatus(status: SyncStatus): Promise<PendingSale[]> {
  const db = await getDB();
  const tx = db.transaction('pendingSales', 'readonly');
  const index = tx.objectStore('pendingSales').index('by-status');
  return index.getAll(status);
}

export async function getPendingSale(id: string): Promise<PendingSale | undefined> {
  const db = await getDB();
  return db.get('pendingSales', id);
}

export async function updatePendingSale(id: string, updates: Partial<PendingSale>): Promise<void> {
  const db = await getDB();
  const existing = await db.get('pendingSales', id);
  if (!existing) return;
  await db.put('pendingSales', { ...existing, ...updates });
}

export async function deletePendingSale(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('pendingSales', id);
}

export async function getSyncQueue(): Promise<PendingSale[]> {
  const db = await getDB();
  const all = await db.getAll('pendingSales');
  return all.filter((s) => s.status === 'PENDING' || s.status === 'FAILED');
}

export async function getPendingSaleCount(): Promise<number> {
  const db = await getDB();
  return db.count('pendingSales');
}
