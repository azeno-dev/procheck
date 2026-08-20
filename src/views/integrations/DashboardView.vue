<template>
  <div class="min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
    
    <!-- Header Toolbar -->
    <div class="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-sm px-4 sm:px-6 lg:px-8 py-4 w-full">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base shadow-sm">
              <i class="pi pi-chart-bar"></i>
            </div>
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Panou Statistici & Rapoarte</h1>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Statistici în timp real, distribuție curieri și istoric sesiuni scanare</p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Refresh stats -->
          <button
            @click="loadStats"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-sm transition-all"
            title="Reîmprospătează datele"
          >
            <i class="pi pi-refresh text-xs"></i>
            <span>Actualizează</span>
          </button>

          <!-- Quick Jump to Verifier -->
          <router-link
            to="/integrations/import"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm hover:shadow transition-all"
          >
            <i class="pi pi-barcode text-xs"></i>
            <span>Deschide Scaner</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <!-- 1. TOP KPI METRICS GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Total Parcels -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Colete Procesate</p>
            <p class="text-2xl font-black text-slate-900 tracking-tight">{{ stats.allTime.totalParcels }}</p>
            <p class="text-[11px] text-slate-400 flex items-center gap-1">
              <i class="pi pi-history text-[10px]"></i>
              <span>În {{ stats.allTime.totalBatches }} sesiuni de lucru</span>
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl shadow-inner">
            <i class="pi pi-box"></i>
          </div>
        </div>

        <!-- Card 2: Ready Parcels -->
        <div class="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Colete Pregătite</p>
            <p class="text-2xl font-black text-emerald-700 tracking-tight">{{ stats.allTime.readyParcels }}</p>
            <p class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Rată validare: {{ stats.allTime.successRate }}%</span>
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
            <i class="pi pi-check-circle"></i>
          </div>
        </div>

        <!-- Card 3: Current Session Pending -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-semibold text-rose-500 uppercase tracking-wider">În Așteptare (Activ)</p>
            <p class="text-2xl font-black text-rose-600 tracking-tight">{{ stats.currentSession.pending }}</p>
            <p class="text-[11px] text-slate-400">Din {{ stats.currentSession.total }} colete curente</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl shadow-inner">
            <i class="pi pi-clock"></i>
          </div>
        </div>

        <!-- Card 4: Global Success Rate -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eficiență Globală</p>
            <p class="text-2xl font-black text-indigo-600 tracking-tight">{{ stats.allTime.successRate }}%</p>
            <div class="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div class="h-full bg-indigo-500 rounded-full" :style="{ width: stats.allTime.successRate + '%' }"></div>
            </div>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-inner">
            <i class="pi pi-percentage"></i>
          </div>
        </div>
      </div>

      <!-- 2. CURRENT ACTIVE SESSION HERO CARD & COURIER BREAKDOWN -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left 2 Cols: Active Session Card -->
        <div class="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <!-- Background glow circle -->
          <div class="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 space-y-4">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sesiune de Scanare Activă
              </span>
              <span class="text-xs text-slate-400 font-mono">{{ new Date().toLocaleDateString('ro-RO') }}</span>
            </div>

            <div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-white">
                {{ stats.currentSession.total > 0 ? `Progres: ${stats.currentSession.ready} din ${stats.currentSession.total} Colete` : 'Nicio sesiune de scanare încărcată' }}
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
                {{ stats.currentSession.total > 0 
                  ? 'Coletele încărcate sunt sincronizate local și gata pentru scanare rapidă cu laser sau camera telefonului.' 
                  : 'Încarcă un fișier Excel sau sincronizează comenzile Sameday pentru a demara verificarea.' }}
              </p>
            </div>

            <!-- Progress bar -->
            <div class="space-y-2 pt-2">
              <div class="flex items-center justify-between text-xs font-semibold">
                <span class="text-slate-300">Rată completare</span>
                <span class="text-emerald-400 font-bold text-sm">{{ stats.currentSession.progress }}%</span>
              </div>
              <div class="w-full h-3.5 bg-slate-700/80 rounded-full overflow-hidden p-0.5 border border-slate-600/50">
                <div
                  class="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-brand-400 rounded-full transition-all duration-500"
                  :style="{ width: stats.currentSession.progress + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Session Actions -->
          <div class="relative z-10 pt-6 mt-6 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3 text-xs">
              <span class="text-emerald-400 font-bold">✓ {{ stats.currentSession.ready }} Pregătite</span>
              <span class="text-slate-500">•</span>
              <span class="text-rose-400 font-bold">⏳ {{ stats.currentSession.pending }} Rămase</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="stats.currentSession.total > 0"
                @click="saveCurrentBatchToDb"
                :disabled="savingBatch"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all disabled:opacity-50"
              >
                <i :class="savingBatch ? 'pi pi-spin pi-spinner' : 'pi pi-cloud-upload'"></i>
                <span>{{ savingBatch ? 'Salvare...' : 'Salvează în DB' }}</span>
              </button>

              <router-link
                to="/integrations/import"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all"
              >
                <span>Continuă Scanarea</span>
                <i class="pi pi-arrow-right text-xs"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right 1 Col: Courier Distribution Breakdown -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i class="pi pi-chart-pie text-brand-600"></i>
              <span>Distribuție pe Curieri</span>
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Volum total colete procesate pe curier</p>
          </div>

          <div class="space-y-3.5">
            <!-- Sameday -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold">
                <span class="flex items-center gap-1.5 text-slate-700">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  Sameday Courier
                </span>
                <span class="text-slate-900 font-bold">{{ stats.courierBreakdown['Sameday'] }} colete</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-red-500 rounded-full" :style="{ width: getCourierPct('Sameday') + '%' }"></div>
              </div>
            </div>

            <!-- Fan Courier -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold">
                <span class="flex items-center gap-1.5 text-slate-700">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  Fan Courier
                </span>
                <span class="text-slate-900 font-bold">{{ stats.courierBreakdown['Fan Courier'] }} colete</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full" :style="{ width: getCourierPct('Fan Courier') + '%' }"></div>
              </div>
            </div>

            <!-- DPD -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold">
                <span class="flex items-center gap-1.5 text-slate-700">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  DPD România
                </span>
                <span class="text-slate-900 font-bold">{{ stats.courierBreakdown['DPD'] }} colete</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-rose-600 rounded-full" :style="{ width: getCourierPct('DPD') + '%' }"></div>
              </div>
            </div>

            <!-- Others -->
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs font-semibold">
                <span class="flex items-center gap-1.5 text-slate-700">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  Alți Curieri
                </span>
                <span class="text-slate-900 font-bold">{{ stats.courierBreakdown['Altele'] }} colete</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-slate-400 rounded-full" :style="{ width: getCourierPct('Altele') + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sincronizat cu istoricul local & DB</span>
            <i class="pi pi-check-circle text-emerald-500"></i>
          </div>
        </div>

      </div>

      <!-- 3. BATCH & SCAN SESSIONS HISTORY TABLE -->
      <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6">
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-base font-bold text-slate-900">Istoric Sesiuni de Lucru & Arhivă Batch-uri</h3>
            <p class="text-xs text-slate-500">Sesiunile salvate pot fi restaurate oricând în verificator sau exportate în Excel</p>
          </div>

          <button
            v-if="stats.recentBatches.length > 0"
            @click="exportHistoryExcel"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all"
          >
            <i class="pi pi-file-excel text-xs"></i>
            <span>Export Istoric Excel</span>
          </button>
        </div>

        <!-- Table -->
        <div v-if="stats.recentBatches.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th class="p-3">Sesiune / Denumire</th>
                <th class="p-3">Sursă</th>
                <th class="p-3">Data</th>
                <th class="p-3 text-center">Total Colete</th>
                <th class="p-3 text-center">Pregătite</th>
                <th class="p-3">Progres</th>
                <th class="p-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="batch in stats.recentBatches" :key="batch.id" class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3 font-semibold text-slate-800">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs">
                      <i :class="batch.source === 'sameday' ? 'pi pi-truck text-red-500' : 'pi pi-file-excel text-emerald-600'"></i>
                    </div>
                    <span>{{ batch.name }}</span>
                  </div>
                </td>
                <td class="p-3">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                    :class="batch.source === 'sameday' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-brand-50 text-brand-700 border border-brand-200'"
                  >
                    {{ batch.source === 'sameday' ? 'Sameday API' : 'Excel Import' }}
                  </span>
                </td>
                <td class="p-3 text-slate-500 whitespace-nowrap">
                  {{ new Date(batch.createdAt).toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'short' }) }}
                </td>
                <td class="p-3 text-center font-mono font-bold text-slate-900">
                  {{ batch.totalCount }}
                </td>
                <td class="p-3 text-center font-mono font-bold text-emerald-600">
                  {{ batch.readyCount }}
                </td>
                <td class="p-3">
                  <div class="flex items-center gap-2">
                    <div class="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" :style="{ width: batch.progress + '%' }"></div>
                    </div>
                    <span class="font-bold text-slate-700 text-[11px]">{{ batch.progress }}%</span>
                  </div>
                </td>
                <td class="p-3 text-right space-x-2 whitespace-nowrap">
                  <button
                    @click="restoreBatch(batch)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                    title="Încarcă în verificator"
                  >
                    <i class="pi pi-external-link text-xs"></i>
                    <span>Deschide</span>
                  </button>
                  <button
                    @click="removeBatch(batch.id)"
                    class="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Șterge sesiune"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty history state -->
        <div v-else class="text-center py-10 text-slate-400 text-sm space-y-2">
          <i class="pi pi-inbox text-3xl block text-slate-300"></i>
          <p>Nu există încă sesiuni salvate în arhivă.</p>
          <p class="text-xs text-slate-400">Fiecare import sau sincronizare de colete va apărea automat aici.</p>
        </div>

      </div>

    </div>

  </div>
</template>

<script lang="ts">
import BatchService, { type BatchSession } from '@/services/batch.services';
import * as XLSX from 'xlsx';
import { toast } from 'vue3-toastify';

export default {
  name: "DashboardView",
  data() {
    return {
      savingBatch: false,
      stats: {
        currentSession: {
          total: 0,
          ready: 0,
          pending: 0,
          progress: 0
        },
        allTime: {
          totalParcels: 0,
          readyParcels: 0,
          totalBatches: 0,
          successRate: 0
        },
        courierBreakdown: {
          'Sameday': 0,
          'Fan Courier': 0,
          'DPD': 0,
          'Cargus': 0,
          'Altele': 0
        } as Record<string, number>,
        recentBatches: [] as BatchSession[]
      }
    };
  },
  created() {
    this.loadStats();
  },
  methods: {
    loadStats() {
      this.stats = BatchService.getStatistics();
    },
    getCourierPct(courier: string): number {
      const total = Object.values(this.stats.courierBreakdown).reduce((a, b) => a + b, 0);
      if (total === 0) return 0;
      return Math.round((this.stats.courierBreakdown[courier] / total) * 100);
    },
    async saveCurrentBatchToDb() {
      const importedDataStr = localStorage.getItem('importedData');
      if (!importedDataStr) {
        toast.warn("Nu există date de salvat în sesiunea curentă.");
        return;
      }

      this.savingBatch = true;
      try {
        const parsed = JSON.parse(importedDataStr);
        const result = await BatchService.saveBatch({
          source: 'excel',
          products: parsed.products || []
        });

        if (result.inDb) {
          toast.success("Sesiunea a fost salvată în Baza de Date PocketBase cu succes!");
        } else {
          toast.success("Sesiunea a fost arhivată în istoricul permanent!");
        }
        this.loadStats();
      } catch (e) {
        toast.error("Eroare la salvarea sesiunii.");
      } finally {
        this.savingBatch = false;
      }
    },
    restoreBatch(batch: BatchSession) {
      if (batch.products && batch.products.length > 0) {
        const dataToStore = {
          expiry: ((new Date()).getTime()) + (12 * 3600 * 1000),
          products: batch.products
        };
        localStorage.setItem('importedData', JSON.stringify(dataToStore));
        toast.success(`Sesiunea "${batch.name}" a fost încărcată în verificator!`);
        this.$router.push('/integrations/import');
      }
    },
    removeBatch(id: string) {
      if (confirm("Sigur doriți să ștergeți această sesiune din istoric?")) {
        BatchService.deleteBatch(id);
        this.loadStats();
        toast.info("Sesiunea a fost ștearsă din arhivă.");
      }
    },
    exportHistoryExcel() {
      const data = this.stats.recentBatches.map(b => ({
        'Denumire Sesiune': b.name,
        'Sursa': b.source,
        'Data Crearii': b.createdAt,
        'Total Colete': b.totalCount,
        'Pregatite': b.readyCount,
        'Ramase': b.pendingCount,
        'Progres %': b.progress + '%'
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Istoric Batch-uri');
      XLSX.writeFile(wb, `procheck-istoric-${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
  }
};
</script>
