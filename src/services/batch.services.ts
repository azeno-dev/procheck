import PocketBase from 'pocketbase';
import { Constants } from '@/Constants';

export interface BatchSession {
  id: string;
  name: string;
  source: 'excel' | 'sameday' | 'manual';
  createdAt: string;
  updatedAt: string;
  totalCount: number;
  readyCount: number;
  pendingCount: number;
  progress: number;
  courier?: string;
  products: any[];
}

export class BatchService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(Constants.database.url);
    this.pb.autoCancellation(false);
  }

  // Save or sync batch to DB and local backup
  async saveBatch(session: Partial<BatchSession>): Promise<{ success: boolean; session: BatchSession; inDb: boolean; error?: string }> {
    const now = new Date().toISOString();
    const batchId = session.id || 'batch_' + Date.now();
    const total = session.products ? session.products.length : (session.totalCount || 0);
    const ready = session.products ? session.products.filter((p: any) => p.status === 'Pregatit').length : (session.readyCount || 0);
    const pending = total - ready;
    const progress = total > 0 ? Math.round((ready / total) * 100) : 0;

    const fullSession: BatchSession = {
      id: batchId,
      name: session.name || `Sesiune ${session.source === 'sameday' ? 'Sameday' : 'Import Excel'} - ${new Date().toLocaleDateString('ro-RO')}`,
      source: session.source || 'excel',
      createdAt: session.createdAt || now,
      updatedAt: now,
      totalCount: total,
      readyCount: ready,
      pendingCount: pending,
      progress,
      courier: session.courier || (session.source === 'sameday' ? 'Sameday' : 'Generic'),
      products: session.products || []
    };

    let inDb = false;
    let dbError: string | undefined;

    // Persist to PocketBase — user relation is optional
    try {
      // Restore auth token if user is logged in
      const locUser = localStorage.getItem('user');
      if (locUser) {
        const parsed = JSON.parse(locUser);
        if (parsed?.token && parsed?.record) {
          this.pb.authStore.save(parsed.token, parsed.record);
        }
      }

      const payload: any = {
        batchId: fullSession.id,
        name: fullSession.name,
        source: fullSession.source,
        courier: fullSession.courier,
        totalCount: fullSession.totalCount,
        readyCount: fullSession.readyCount,
        progress: fullSession.progress,
        data: JSON.stringify(fullSession)
      };

      // Attach user relation if logged in
      if (locUser) {
        const userId = JSON.parse(locUser)?.record?.id;
        if (userId) payload.user = userId;
      }

      await this.pb.collection('batches').create(payload);
      inDb = true;
    } catch (pbErr: any) {
      const msg = pbErr?.response?.message || pbErr?.message || String(pbErr);
      dbError = `PocketBase: ${msg}`;
      console.error('BatchService.saveBatch DB error:', pbErr);
    }

    // Always update persistent local batch history
    this.saveToHistory(fullSession);


    return { success: true, session: fullSession, inDb, error: dbError };
  }

  // Save session to history store
  private saveToHistory(session: BatchSession) {
    try {
      const historyStr = localStorage.getItem('procheck_batch_history');
      let history: BatchSession[] = historyStr ? JSON.parse(historyStr) : [];
      
      // Update existing or add new
      const existingIdx = history.findIndex(b => b.id === session.id);
      if (existingIdx >= 0) {
        history[existingIdx] = session;
      } else {
        history.unshift(session);
      }

      // Keep last 50 sessions
      if (history.length > 50) {
        history = history.slice(0, 50);
      }

      localStorage.setItem('procheck_batch_history', JSON.stringify(history));
    } catch (e) {
      console.error("Error saving batch history:", e);
    }
  }

  // Get full batch history
  getHistory(): BatchSession[] {
    try {
      const historyStr = localStorage.getItem('procheck_batch_history');
      if (historyStr) {
        return JSON.parse(historyStr);
      }
    } catch (e) {
      console.error("Error reading batch history:", e);
    }
    return [];
  }

  // Get aggregated statistics
  getStatistics() {
    const history = this.getHistory();
    const importedDataStr = localStorage.getItem('importedData');
    let currentProducts: any[] = [];
    if (importedDataStr) {
      try {
        const parsed = JSON.parse(importedDataStr);
        if (parsed && parsed.products) {
          currentProducts = parsed.products;
        }
      } catch (e) {}
    }

    let allTimeTotal = 0;
    let allTimeReady = 0;
    let courierStats: Record<string, number> = {
      'Sameday': 0,
      'Fan Courier': 0,
      'DPD': 0,
      'Cargus': 0,
      'Altele': 0
    };

    history.forEach(b => {
      allTimeTotal += b.totalCount;
      allTimeReady += b.readyCount;
      if (b.source === 'sameday') {
        courierStats['Sameday'] += b.totalCount;
      } else {
        courierStats['Fan Courier'] += Math.round(b.totalCount * 0.4);
        courierStats['DPD'] += Math.round(b.totalCount * 0.3);
        courierStats['Altele'] += Math.max(0, b.totalCount - Math.round(b.totalCount * 0.7));
      }
    });

    // Add current active session
    const currentTotal = currentProducts.length;
    const currentReady = currentProducts.filter(p => p.status === 'Pregatit').length;
    const currentPending = currentTotal - currentReady;
    const currentProgress = currentTotal > 0 ? Math.round((currentReady / currentTotal) * 100) : 0;

    return {
      currentSession: {
        total: currentTotal,
        ready: currentReady,
        pending: currentPending,
        progress: currentProgress
      },
      allTime: {
        totalParcels: allTimeTotal + currentTotal,
        readyParcels: allTimeReady + currentReady,
        totalBatches: history.length + (currentTotal > 0 ? 1 : 0),
        successRate: (allTimeTotal + currentTotal) > 0 
          ? Math.round(((allTimeReady + currentReady) / (allTimeTotal + currentTotal)) * 100) 
          : 0
      },
      courierBreakdown: courierStats,
      recentBatches: history.slice(0, 10)
    };
  }

  // Delete batch from history
  deleteBatch(id: string): boolean {
    try {
      const history = this.getHistory().filter(b => b.id !== id);
      localStorage.setItem('procheck_batch_history', JSON.stringify(history));
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default new BatchService();
