<template>
  <div class="min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
    
    <!-- Modern Command Center Header (Second Header) -->
    <div class="sticky top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-sm px-4 sm:px-6 lg:px-8 py-3 w-full space-y-3">
      
      <!-- Upper Command Bar: Inputs + Primary Action Cluster -->
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full">
        
        <!-- Left: Search & Scanner Hub -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 w-full lg:max-w-3xl">
          <!-- Direct AWB Scanner Input -->
          <div class="relative flex-1" id="searchHeader">
            <div class="relative flex items-center">
              <i class="pi pi-barcode absolute left-3 text-brand-600 dark:text-brand-400 text-lg"></i>
              <input
                ref="barcodeInput"
                v-model="searchQueryAWB"
                :tabindex="0"
                id="searchInputAWB"
                type="text"
                class="w-full pl-9 pr-24 py-2 border rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-semibold"
                :class="activSearch ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500' : 'bg-white dark:bg-slate-800 border-brand-400 dark:border-brand-500 text-slate-900 dark:text-white shadow-sm focus:border-brand-600'"
                placeholder="Scanează AWB..."
                @mouseenter="activSearch = false; searchQuery = ''"
                :readonly="activSearch"
              />
              
              <!-- In-Input Camera & Clear Actions -->
              <div class="absolute right-1.5 flex items-center gap-1">
                <button
                  v-if="searchQueryAWB"
                  @click="searchQueryAWB = ''"
                  class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md"
                  title="Șterge"
                >
                  <i class="pi pi-times text-xs"></i>
                </button>
                <button
                  type="button"
                  @click="showCameraScanner = true"
                  class="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 rounded-lg text-xs font-bold border border-brand-200 dark:border-brand-800 transition-colors"
                  title="Scanează cu camera telefonului"
                >
                  <i class="pi pi-camera text-xs"></i>
                  <span>Cameră</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Client & City Filter -->
          <div class="relative sm:w-64">
            <div class="relative flex items-center">
              <i class="pi pi-search absolute left-3 text-slate-400 text-xs"></i>
              <input
                v-model="searchQuery"
                type="text"
                class="w-full pl-8 pr-8 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                :class="!activSearch ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500' : 'bg-white dark:bg-slate-800 border-brand-400 dark:border-brand-500 text-slate-900 dark:text-white shadow-sm focus:border-brand-600'"
                placeholder="Filtru client, oraș..."
                @mouseenter="activSearch = true; searchQueryAWB = ''"
                :readonly="!activSearch"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md"
                title="Șterge"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Grouped Action Clusters -->
        <div class="flex items-center flex-wrap gap-2 justify-between lg:justify-end shrink-0">
          
          <!-- Hidden file input for Excel upload -->
          <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput" accept=".xlsx, .xls">

          <!-- Primary Actions (Import & Save) -->
          <div class="flex items-center gap-1.5">
            <button
              @click="triggerFileInput"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm hover:shadow transition-all"
            >
              <i class="pi pi-file-import text-xs"></i>
              <span>Import Excel</span>
            </button>

            <button
              @click="saveBatchToDb"
              :disabled="products.length === 0 || savingToDb"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Salvează sesiunea în Baza de Date"
            >
              <i :class="savingToDb ? 'pi pi-spin pi-spinner text-xs text-brand-600 dark:text-brand-400' : 'pi pi-cloud-upload text-xs text-brand-600 dark:text-brand-400'"></i>
              <span>{{ savingToDb ? 'Salvare...' : 'Salvează DB' }}</span>
            </button>
          </div>

          <!-- Divider -->
          <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <!-- Secondary Tools Group -->
          <div class="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
            <!-- Export -->
            <button
              @click="exportData"
              :disabled="products.length === 0"
              class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Exportă tabelul în Excel"
            >
              <i class="pi pi-file-excel text-xs"></i>
              <span class="hidden sm:inline">Export</span>
            </button>

            <!-- Live Multi-Device Sync -->
            <button
              @click="showPairingModal = true"
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all"
              title="Conectare Telefon ↔ Desktop"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
              <span>Live Sync</span>
            </button>

            <!-- Sound Mute/Unmute -->
            <button
              @click="soundEnabled = !soundEnabled; saveDataToLocalStorage('soundEnabled', soundEnabled)"
              class="p-1.5 rounded-lg text-xs font-semibold hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-colors"
              :class="soundEnabled ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'"
              :title="soundEnabled ? 'Sunet activat (click pentru mut)' : 'Sunet dezactivat'"
            >
              <i :class="soundEnabled ? 'pi pi-volume-up' : 'pi pi-volume-off'"></i>
            </button>

            <!-- Reset Data -->
            <button
              @click="showClearConfirm = true"
              :disabled="products.length === 0"
              class="p-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Șterge datele curente"
            >
              <i class="pi pi-trash"></i>
            </button>

            <!-- Settings -->
            <button
              @click="showSettingsDrawer = true"
              class="p-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-colors"
              title="Setări scaner și temporizatoare"
            >
              <i class="pi pi-cog"></i>
            </button>
          </div>

        </div>
      </div>

      <!-- Lower Status Ribbon: Segmented Filters + Centered Progress + View Mode -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 w-full">
        
        <!-- Filter Pills Segmented Control -->
        <div class="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl text-xs font-bold border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
          <button
            @click="activeTab = 'all'"
            class="px-3.5 py-1.5 rounded-lg transition-all"
            :class="activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          >
            Toate ({{ products.length }})
          </button>
          <button
            @click="activeTab = 'ready'"
            class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
            :class="activeTab === 'ready' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="activeTab === 'ready' ? 'bg-white' : 'bg-emerald-500'"></span>
            <span>Pregătite ({{ countActive }})</span>
          </button>
          <button
            @click="activeTab = 'pending'"
            class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
            :class="activeTab === 'pending' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="activeTab === 'pending' ? 'bg-white' : 'bg-rose-500'"></span>
            <span>Rămase ({{ products.length - countActive }})</span>
          </button>
        </div>

        <!-- Right: Integrated Progress Pill & View Mode Switcher -->
        <div class="flex items-center gap-3 justify-between sm:justify-end">
          <!-- Clean Progress Pill -->
          <div class="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progres:</span>
            <div class="w-24 sm:w-32 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <span class="text-xs font-black text-slate-800 dark:text-white min-w-[2.5rem]">{{ progressPercentage }}%</span>
          </div>

          <!-- View Mode Toggle (Cards vs Table) -->
          <div class="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <button
              @click="viewMode = 'grid'"
              class="p-1.5 rounded-lg text-xs transition-all"
              :class="viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'"
              title="Vizualizare Carduri"
            >
              <i class="pi pi-th-large"></i>
            </button>
            <button
              @click="viewMode = 'table'"
              class="p-1.5 rounded-lg text-xs transition-all"
              :class="viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'"
              title="Vizualizare Tabel"
            >
              <i class="pi pi-list"></i>
            </button>
          </div>
        </div>

      </div>

    </div>

    <!-- Main Workspace Content -->
    <div class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
      
      <!-- Empty State / Dropzone -->
      <div v-if="products.length === 0" class="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900/70 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4 my-8 shadow-sm max-w-2xl mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-3xl shadow-inner">
          <i class="pi pi-file-excel"></i>
        </div>
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Niciun colet încărcat</h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Încarcă un fișier Excel (.xlsx) exportat din platforma de curierat pentru a începe scanarea și verificarea coletelor.
          </p>
        </div>
        <button
          @click="triggerFileInput"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-primary-600 hover:from-brand-500 hover:to-primary-500 shadow-md transition-all"
        >
          <i class="pi pi-upload"></i>
          <span>Selectează Fișier Excel</span>
        </button>
      </div>

      <!-- Content State -->
      <div v-else class="w-full">
        <!-- No search results state -->
        <div v-if="displayedProducts.length === 0" class="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-sm border border-slate-200 dark:border-slate-800 w-full">
          <i class="pi pi-search text-2xl text-slate-400 mb-2 block"></i>
          Nu a fost găsit niciun colet care să corespundă filtrului sau căutării.
        </div>

        <!-- 1. GRID VIEW MODE (Full Screen Fluid Grid) -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 gap-4 w-full">
          <div
            v-for="product in displayedProducts"
            :key="product.id"
            class="bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 p-4 flex flex-col justify-between relative shadow-sm hover:shadow-card-hover group"
            :class="product.status === activStatus ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800'"
          >
            <!-- Card Header: Status Toggle Pill & Scan Order Index -->
            <div class="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                @click="updateStatus(product)"
                class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors"
                :class="product.status === activStatus ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
                title="Click pentru a schimba statusul"
              >
                <span class="w-2 h-2 rounded-full" :class="product.status === activStatus ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                <span>{{ product.status }}</span>
              </button>

              <span v-if="product.index" class="w-6 h-6 rounded-full bg-slate-900 dark:bg-brand-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shadow-sm">
                {{ product.index }}
              </span>
            </div>

            <!-- Card Body: AWB & Client Details -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md select-all">
                  {{ product.awb }}
                </span>
                <button
                  @click="copyToClipboard(product.awb)"
                  class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copiază AWB"
                >
                  <i class="pi pi-copy text-xs"></i>
                </button>
              </div>

              <div class="space-y-1 text-xs">
                <p class="font-semibold text-slate-800 dark:text-slate-200 truncate" :title="product.clientName">
                  <i class="pi pi-user text-slate-400 text-[10px] mr-1"></i>
                  {{ product.clientName || 'Client nespecificat' }}
                </p>

                <p v-if="product.clientPhone" class="text-slate-600 dark:text-slate-400">
                  <a :href="'tel:' + product.clientPhone" class="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1">
                    <i class="pi pi-phone text-slate-400 text-[10px]"></i>
                    <span>{{ product.clientPhone }}</span>
                  </a>
                </p>

                <p v-if="product.date" class="text-slate-400 dark:text-slate-500 text-[11px]">
                  <i class="pi pi-calendar text-[10px] mr-1"></i>
                  {{ product.date }}
                </p>

                <p v-if="product.observations" class="text-slate-500 dark:text-slate-400 text-[11px] bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 line-clamp-2" :title="product.observations">
                  {{ product.observations }}
                </p>
              </div>
            </div>

            <!-- Card Footer: Quick Actions -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                @click="updateStatus(product)"
                class="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500"
              >
                {{ product.status === activStatus ? 'Marchează Nepregătit' : 'Marchează Pregătit' }}
              </button>

              <button
                @click="deleteProduct(product.awb)"
                class="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                title="Șterge colet din listă"
              >
                <i class="pi pi-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 2. TABLE VIEW MODE -->
        <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="p-3 text-center w-12">#</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 font-mono">AWB</th>
                  <th class="p-3">Client</th>
                  <th class="p-3">Telefon</th>
                  <th class="p-3">Data</th>
                  <th class="p-3">Observații</th>
                  <th class="p-3 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  v-for="(product, idx) in displayedProducts"
                  :key="product.id"
                  class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  :class="product.status === activStatus ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''"
                >
                  <td class="p-3 text-center font-mono font-bold text-slate-500 dark:text-slate-400">
                    {{ product.index || (idx + 1) }}
                  </td>
                  <td class="p-3">
                    <button
                      @click="updateStatus(product)"
                      class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors"
                      :class="product.status === activStatus ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="product.status === activStatus ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                      <span>{{ product.status }}</span>
                    </button>
                  </td>
                  <td class="p-3 font-mono font-bold text-slate-900 dark:text-white select-all">
                    {{ product.awb }}
                  </td>
                  <td class="p-3 font-medium text-slate-800 dark:text-slate-200">
                    {{ product.clientName || '—' }}
                  </td>
                  <td class="p-3 text-slate-600 dark:text-slate-400">
                    <a v-if="product.clientPhone" :href="'tel:' + product.clientPhone" class="hover:text-brand-600">
                      {{ product.clientPhone }}
                    </a>
                    <span v-else>—</span>
                  </td>
                  <td class="p-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {{ product.date || '—' }}
                  </td>
                  <td class="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate" :title="product.observations">
                    {{ product.observations || '—' }}
                  </td>
                  <td class="p-3 text-right space-x-2">
                    <button
                      @click="updateStatus(product)"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Schimbă status"
                    >
                      <i class="pi pi-sync text-xs"></i>
                    </button>
                    <button
                      @click="deleteProduct(product.awb)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Șterge"
                    >
                      <i class="pi pi-trash text-xs"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>

    <!-- Settings Dialog / Drawer -->
    <Dialog
      v-model:visible="showSettingsDrawer"
      @close="showSettingsDrawer = false"
      header="Configurare Verificator & Scanare"
      modal
      :style="{ width: '28rem' }"
      :breakpoints="{ '575px': '92vw' }"
    >
      <div class="space-y-4 pt-2">
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Sufix ignorat la scanare AWB</label>
          <InputText
            v-model="awbEndWith"
            type="text"
            class="w-full text-sm font-mono"
            @change="saveDataToLocalStorage('awbEndWith', awbEndWith)"
          />
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Ex: 001 (pentru AWB-uri care se termină cu index de colet)</p>
        </div>

        <div class="space-y-1">
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Lungime minimă AWB (caractere)</label>
          <InputNumber
            v-model="awbLength"
            class="w-full text-sm"
            @change="saveDataToLocalStorage('awbLength', awbLength)"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Temporizator Auto-Clear input (secunde)</label>
          <InputNumber
            v-model="delayAutoClear"
            class="w-full text-sm"
            @change="saveDataToLocalStorage('delayAutoClear', delayAutoClear)"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Expirare sesiune locală (ore)</label>
          <InputNumber
            v-model="delayClearData"
            class="w-full text-sm"
            @change="saveDataToLocalStorage('delayClearData', delayClearData)"
          />
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Semnale sonore scanare</span>
          <InputSwitch v-model="soundEnabled" @change="saveDataToLocalStorage('soundEnabled', soundEnabled)" />
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Salvare automată în DB</span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400">Sincronizează la fiecare validare</span>
          </div>
          <InputSwitch v-model="autoSaveDb" @change="saveDataToLocalStorage('autoSaveDb', autoSaveDb)" />
        </div>

        <!-- Live Phone <-> Desktop Multi-Device Sync Section -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-100 block">Sincronizare Telefon ↔ Desktop</span>
              <span class="text-[10px] text-slate-500 dark:text-slate-400">Scanează cu telefonul, vezi rezultatele pe ecranul mare</span>
            </div>
            <InputSwitch v-model="liveSyncEnabled" @change="saveDataToLocalStorage('liveSyncEnabled', liveSyncEnabled)" />
          </div>

          <button
            type="button"
            @click="showPairingModal = true"
            class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <i class="pi pi-qrcode text-xs"></i>
            <span>Conectare Telefon prin QR Code</span>
          </button>
        </div>

        <!-- Collapsible Custom Sound Settings & DB Audio Upload at the end -->
        <div v-if="soundEnabled" class="pt-3 border-t border-slate-100 dark:border-slate-800">
          <SoundSettings />
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button label="Închide" severity="secondary" @click="showSettingsDrawer = false" />
        </div>
      </div>
    </Dialog>

    <!-- Clear Confirmation Dialog -->
    <Dialog
      v-model:visible="showClearConfirm"
      @close="showClearConfirm = false"
      header="Confirmare Resetare"
      modal
      :style="{ width: '24rem' }"
    >
      <div class="space-y-4 pt-2">
        <p class="text-sm text-slate-600 dark:text-slate-300">Sigur dorești să ștergi toate cele {{ products.length }} colete din sesiunea curentă?</p>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button label="Anulează" severity="secondary" text @click="showClearConfirm = false" />
          <Button label="Șterge Tot" severity="danger" @click="clearData(); showClearConfirm = false" />
        </div>
      </div>
    </Dialog>

    <!-- Floating Camera Scanner Trigger for Mobile -->
    <button
      @click="showCameraScanner = true"
      class="fixed bottom-6 right-6 sm:hidden z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 to-primary-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
      title="Scanează Barcode cu Camera"
    >
      <i class="pi pi-camera text-2xl"></i>
    </button>

    <!-- Camera Scanner Modal -->
    <CameraScannerModal
      v-model="showCameraScanner"
      @scan="handleCameraScan"
    />

    <!-- Device Pairing QR Modal -->
    <DevicePairingModal
      v-model="showPairingModal"
      :currentAwbList="products"
      @simulate-scan="handleIncomingLiveScan"
    />

  </div>
</template>

<script lang="ts">
import * as XLSX from 'xlsx';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import CameraScannerModal from '@/components/CameraScannerModal.vue';
import DevicePairingModal from '@/components/DevicePairingModal.vue';
import SoundSettings from '@/components/SoundSettings.vue';
import BatchService from '@/services/batch.services';
import LiveSyncService, { type LiveScanEvent } from '@/services/livesync.services';
import soundService from '@/services/sound.services';

export default {
  name: "ProductView",
  components: {
    CameraScannerModal,
    DevicePairingModal,
    SoundSettings,
  },
  data() {
    return {
      showCameraScanner: false,
      showPairingModal: false,
      liveSyncEnabled: true,
      savingToDb: false,
      autoSaveDb: false,
      searchQueryAWB: '',
      searchQuery: '',
      activStatus: 'Pregatit',
      inactivStatus: 'Nepregatit',
      delayAutoClear: 5,
      awbLength: 14,
      awbEndWith: "001",
      delayClearData: 12,
      activSearch: false,
      countActive: 0,
      soundEnabled: true,
      viewMode: 'grid' as 'grid' | 'table',
      activeTab: 'all' as 'all' | 'ready' | 'pending',
      showSettingsDrawer: false,
      showClearConfirm: false,
      products: [] as any[],
      timeout: null as any,
    };
  },
  setup() {
    const notifyAWBExist = (awb: string, delay: number) => {
      toast(`AWB #${awb.toUpperCase()} a fost validat!`, {
        autoClose: (delay * 3) * 1000,
        type: "success",
        position: "bottom-right",
      });
    };
    const notifyAWBDouble = (awb: string, count: number) => {
      toast(`ATENȚIE: AWB #${awb.toUpperCase()} a fost găsit de ${count} ori!`, {
        type: "warning",
        position: "bottom-right",
        autoClose: false,
      });
    };
    const notifyAWBError = (awb: string) => {
      toast(`EROARE: AWB #${awb.toUpperCase()} nu a fost găsit în listă!`, {
        type: "error",
        position: "bottom-right",
        autoClose: false,
      });
    };

    return { notifyAWBExist, notifyAWBDouble, notifyAWBError };
  },
  computed: {
    progressPercentage(): number {
      if (this.products.length === 0) return 0;
      return Math.round((this.countActive / this.products.length) * 100);
    },
    filteredProductsByAWB(): any[] {
      if (this.products.length === 0) return [];
      if (this.searchQueryAWB.length < this.awbLength) return this.products;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let valueSearch = "";
        if (this.searchQueryAWB.endsWith(this.awbEndWith) && this.searchQueryAWB.length >= this.awbLength + this.awbEndWith.length) {
          valueSearch = this.searchQueryAWB.trim().toLowerCase().replace(this.awbEndWith, "");
        } else if (this.searchQueryAWB.length >= this.awbLength) {
          valueSearch = this.searchQueryAWB.trim().toLowerCase();
        } else {
          return this.products;
        }

        const result = this.products.filter(product =>
          product.awb && product.awb.trim().toLowerCase().includes(valueSearch)
        );

        this.activSearch = true;
        if (result.length === 1) {
          result[0].status = this.activStatus;
          this.sortByStatus(this.products);
          this.countActive = this.products.filter(p => p.status === this.activStatus).length;
          result[0].index = this.countActive;
          this.saveToLocalStorage(this.products);

          if (this.activSearch) {
            setTimeout(() => {
              this.notifyAWBExist(valueSearch, this.delayAutoClear);
              soundService.playSound('success', this.soundEnabled);
            }, 200);

            setTimeout(() => {
              this.searchQueryAWB = '';
              this.activSearch = false;
            }, this.delayAutoClear * 1000);
          }
        } else if (result.length > 1) {
          setTimeout(() => {
            this.searchQueryAWB = '';
            this.notifyAWBDouble(valueSearch, result.length);
            soundService.playSound('warning', this.soundEnabled);
          }, 100);
        } else if (result.length === 0) {
          setTimeout(() => {
            this.searchQueryAWB = '';
            this.notifyAWBError(valueSearch);
            soundService.playSound('error', this.soundEnabled);
          }, 100);
        }

        return result;
      }, 400);

      return this.products;
    },
    filteredProducts(): any[] {
      if (this.products.length === 0) return [];
      if (!this.activSearch) return this.products;

      const q = this.searchQuery.toLowerCase();
      return this.products.filter(product =>
        (product.awb && product.awb.trim().toLowerCase().includes(q)) ||
        (product.date && product.date.toLowerCase().includes(q)) ||
        (product.clientName && product.clientName.toLowerCase().includes(q)) ||
        (product.clientPhone && product.clientPhone.toLowerCase().includes(q)) ||
        (product.observations && product.observations.toLowerCase().includes(q))
      );
    },
    displayedProducts(): any[] {
      const source = this.activSearch ? this.filteredProducts : this.filteredProductsByAWB;
      if (this.activeTab === 'ready') {
        return source.filter(p => p.status === this.activStatus);
      } else if (this.activeTab === 'pending') {
        return source.filter(p => p.status !== this.activStatus);
      }
      return source;
    }
  },
  created() {
    this.initData();
  },
  mounted() {
    // Check room query param for instant phone pairing
    if (this.$route.query.room) {
      const room = this.$route.query.room as string;
      LiveSyncService.setRoomId(room);
      toast.info(`📱 Dispozitiv conectat la camera live: ${room}`);
    } else {
      LiveSyncService.initChannel(LiveSyncService.getOrCreateRoomId());
    }

    // Subscribe to incoming scan events from phone / another device
    LiveSyncService.onScanEvent((event: LiveScanEvent) => {
      if (this.liveSyncEnabled && event.type === 'SCAN_AWB' && event.awb) {
        this.handleIncomingLiveScan(event.awb);
      }
    });
  },
  methods: {
    initData() {
      const liveSyncJson = localStorage.getItem('liveSyncEnabled');
      if (liveSyncJson !== null) this.liveSyncEnabled = liveSyncJson === 'true';

      const awbEndWithJson = localStorage.getItem('awbEndWith');
      if (awbEndWithJson) this.awbEndWith = awbEndWithJson;

      const awbLengthJson = localStorage.getItem('awbLength');
      if (awbLengthJson) this.awbLength = parseInt(awbLengthJson);

      const delayAutoClearJson = localStorage.getItem('delayAutoClear');
      if (delayAutoClearJson) this.delayAutoClear = parseInt(delayAutoClearJson);

      const delayClearDataJson = localStorage.getItem('delayClearData');
      if (delayClearDataJson) this.delayClearData = parseInt(delayClearDataJson);

      const soundEnabledJson = localStorage.getItem('soundEnabled');
      if (soundEnabledJson !== null) this.soundEnabled = soundEnabledJson === 'true';

      const autoSaveDbJson = localStorage.getItem('autoSaveDb');
      if (autoSaveDbJson !== null) this.autoSaveDb = autoSaveDbJson === 'true';

      const json = localStorage.getItem('importedData');
      if (json) {
        try {
          const data = JSON.parse(json);
          if (data) {
            if ((new Date()).getTime() > data.expiry) {
              localStorage.removeItem('importedData');
              this.products = [];
              this.countActive = 0;
              return;
            }

            if (data.products && data.products.length > 0) {
              this.products = data.products;
              this.sortByStatus(this.products);
              this.countActive = this.products.filter(p => p.status === this.activStatus).length;
            }
          }
        } catch (e) {
          console.error("Error loading local storage data:", e);
        }
      }
    },
    updateStatus(product: any) {
      if (product.status !== this.activStatus) {
        product.status = this.activStatus;
        soundService.playSound('success', this.soundEnabled);
      } else {
        product.status = this.inactivStatus;
        product.index = "";
      }

      this.saveToLocalStorage(this.products);
      this.sortByStatus(this.products);
      this.countActive = this.products.filter(p => p.status === this.activStatus).length;

      if (product.status === this.activStatus) {
        product.index = this.countActive;
      }

      if (this.liveSyncEnabled) {
        LiveSyncService.broadcastScan(product.awb, product.status, product);
      }
    },
    triggerFileInput() {
      (this.$refs.fileInput as HTMLInputElement).click();
    },
    handleFileUpload(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.readExcelFile(file);
      }
    },
    readExcelFile(file: any) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const importedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const values = importedData.slice(1).map((row: any, index: number) => {
          return {
            id: index + Date.now(),
            awb: (row[0] || '').toString().trim(),
            date: row[2] || '',
            status: row[4] && row[4] === this.activStatus ? this.activStatus : this.inactivStatus,
            clientName: row[21] || '',
            clientPhone: (row[26] || '').toString(),
            observations: row[27] || '',
            index: "",
          };
        }).filter((item: any) => item.awb.length > 0);

        if (this.products.length > 0) {
          this.products = [...this.products, ...values];
        } else {
          this.products = values;
        }

        this.sortByStatus(this.products);
        this.countActive = this.products.filter(p => p.status === this.activStatus).length;
        this.saveToLocalStorage(this.products);

        toast.success(`Au fost importate ${values.length} colete cu succes!`);
      };

      reader.readAsArrayBuffer(file);
    },
    saveToLocalStorage(products: any[]) {
      const dataToStore = {
        expiry: ((new Date()).getTime()) + ((this.delayClearData * 3600) * 1000),
        products,
      };
      localStorage.setItem('importedData', JSON.stringify(dataToStore));

      if (this.autoSaveDb && products.length > 0) {
        BatchService.saveBatch({
          source: 'excel',
          products: products
        });
      }
    },
    async saveBatchToDb() {
      if (this.products.length === 0) return;
      this.savingToDb = true;
      try {
        const res = await BatchService.saveBatch({
          source: 'excel',
          products: this.products
        });
        if (res.inDb) {
          toast.success("Coletele au fost salvate în baza de date PocketBase!");
        } else {
          toast.success("Sesiunea a fost sincronizată în arhiva permanentă!");
        }
      } catch (e) {
        toast.error("Eroare la salvarea în baza de date.");
      } finally {
        this.savingToDb = false;
      }
    },
    saveDataToLocalStorage(key: string, data: any) {
      localStorage.setItem(key, data.toString());
    },
    sortByStatus(values: any[]) {
      this.products = values.sort((a: any, b: any) => {
        const x = a.status ? a.status.toLowerCase() : "";
        const y = b.status ? b.status.toLowerCase() : "";
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    deleteProduct(awb: string) {
      this.products = this.products.filter(product => product.awb !== awb);
      this.saveToLocalStorage(this.products);
      this.sortByStatus(this.products);
      this.countActive = this.products.filter(p => p.status === this.activStatus).length;
    },
    exportData() {
      const exportData = this.products.map(({ awb, date, status, clientName, clientPhone, observations }) => [
        awb, date, status, clientName, clientPhone, observations
      ]);
      const ws = XLSX.utils.aoa_to_sheet([
        ['AWB', 'Data crearii', 'Status', 'Nume destinatar', 'Telefon destinatar', 'Observatii'],
        ...exportData
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Colete Verificate');
      XLSX.writeFile(wb, `procheck-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
    clearData() {
      this.products = [];
      this.countActive = 0;
      localStorage.removeItem('importedData');
      toast.info("Datele au fost resetate.");
    },
    copyToClipboard(text: string) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        toast.info(`AWB ${text} copiat în clipboard`);
      }
    },
    handleCameraScan(scannedAWB: string) {
      this.activSearch = false;
      this.searchQueryAWB = scannedAWB;
      if (this.liveSyncEnabled) {
        LiveSyncService.broadcastScan(scannedAWB, this.activStatus, undefined, 'mobile');
      }
    },
    handleIncomingLiveScan(scannedAwb: string) {
      if (!scannedAwb || this.products.length === 0) return;
      const cleanAwb = scannedAwb.trim().toLowerCase();
      const match = this.products.find(p => p.awb && p.awb.trim().toLowerCase() === cleanAwb);
      if (match) {
        if (match.status !== this.activStatus) {
          match.status = this.activStatus;
          this.sortByStatus(this.products);
          this.countActive = this.products.filter(p => p.status === this.activStatus).length;
          match.index = this.countActive;
          this.saveToLocalStorage(this.products);
          soundService.playSound('success', this.soundEnabled);
          toast.success(`📱 Sincronizat de pe telefon: AWB #${match.awb}`);
        }
      }
    }
  }
};
</script>