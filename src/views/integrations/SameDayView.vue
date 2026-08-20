<template>
  <div class="min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
    
    <!-- Modern Single Command Bar Header -->
    <div class="sticky top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-sm w-full relative">
      <div class="px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full">
        
        <!-- Left: Search & Scanner Hub with Dynamic On-Click/Focus Expansion -->
        <div class="flex items-center gap-2 flex-1 min-w-0 max-w-full md:max-w-md lg:max-w-lg transition-all duration-300">
          <!-- Direct AWB Scanner Input -->
          <div
            class="relative transition-all duration-300 ease-out"
            :class="!activSearch ? 'flex-1 min-w-[190px] max-w-xs sm:max-w-sm' : 'w-32 sm:w-40 shrink-0'"
            id="searchHeader"
          >
            <div class="relative flex items-center">
              <i class="pi pi-barcode absolute left-3 text-red-600 dark:text-red-400 text-base"></i>
              <input
                ref="barcodeInput"
                v-model="searchQueryAWB"
                :tabindex="0"
                id="searchInputAWB"
                type="text"
                class="w-full pl-8 pr-12 py-1.5 border rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-semibold"
                :class="activSearch ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-pointer' : 'bg-white dark:bg-slate-800 border-red-300 dark:border-red-500 text-slate-900 dark:text-white shadow-xs focus:border-red-500'"
                :placeholder="!activSearch ? 'Scanează AWB Sameday...' : 'AWB'"
                @click="activSearch = false; searchQuery = ''"
                @focus="activSearch = false; searchQuery = ''"
                @mouseenter="activSearch = false; searchQuery = ''"
                :readonly="activSearch"
              />
              
              <!-- In-Input Camera & Clear Actions -->
              <div class="absolute right-1.5 flex items-center gap-0.5 z-20 pointer-events-auto">
                <button
                  v-if="searchQueryAWB"
                  type="button"
                  @click.stop.prevent="clearAwbInput"
                  @mousedown.stop.prevent
                  class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                  title="Șterge text"
                >
                  <i class="pi pi-times text-[10px]"></i>
                </button>
                <button
                  type="button"
                  @click.stop.prevent="showCameraScanner = true"
                  @mousedown.stop.prevent
                  class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                  title="Scanează cu camera telefonului"
                >
                  <i class="pi pi-camera text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Client & City Filter -->
          <div
            class="relative transition-all duration-300 ease-out"
            :class="activSearch ? 'flex-1 min-w-[190px] max-w-xs sm:max-w-sm' : 'w-32 sm:w-40 shrink-0'"
          >
            <div class="relative flex items-center">
              <i class="pi pi-search absolute left-2.5 text-slate-400 text-xs pointer-events-none"></i>
              <input
                ref="clientSearchInput"
                v-model="searchQuery"
                type="text"
                class="w-full pl-7 pr-7 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                :class="!activSearch ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-pointer' : 'bg-white dark:bg-slate-800 border-red-300 dark:border-red-500 text-slate-900 dark:text-white shadow-xs focus:border-red-500'"
                :placeholder="activSearch ? 'Filtru client, oraș, status...' : 'Filtru client...'"
                @click="activSearch = true; searchQueryAWB = ''"
                @focus="activSearch = true; searchQueryAWB = ''"
                @mouseenter="activSearch = true; searchQueryAWB = ''"
                :readonly="!activSearch"
              />
              <button
                v-if="searchQuery"
                type="button"
                @click.stop.prevent="clearClientSearch"
                @mousedown.stop.prevent
                class="absolute right-1.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer z-20"
                title="Șterge"
              >
                <i class="pi pi-times text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Center: Status Filter Pills Perfectly Centered -->
        <div class="flex items-center justify-center shrink-0">
          <div class="inline-flex items-center gap-0.5 bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-xl text-[11px] font-bold border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
            <button
              @click="activeTab = 'all'"
              class="px-2.5 py-1 rounded-lg transition-all"
              :class="activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            >
              Toate ({{ products.length }})
            </button>
            <button
              @click="activeTab = 'ready'"
              class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
              :class="activeTab === 'ready' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="activeTab === 'ready' ? 'bg-white' : 'bg-emerald-500'"></span>
              <span>Pregătite ({{ countActive }})</span>
            </button>
            <button
              @click="activeTab = 'pending'"
              class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
              :class="activeTab === 'pending' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="activeTab === 'pending' ? 'bg-white' : 'bg-rose-500'"></span>
              <span>Rămase ({{ products.length - countActive }})</span>
            </button>
          </div>
        </div>

        <!-- Right: Actions + Tools + View Switcher -->
        <div class="flex items-center justify-end flex-wrap gap-2 shrink-0">
          
          <!-- Hidden file input for Excel upload -->
          <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput" accept=".xlsx, .xls">

          <!-- Primary Actions (Sameday Sync with Time-Range Selector & Save DB) -->
          <div class="flex items-center gap-1.5">
            <!-- Sync Time Range Dropdown -->
            <select
              v-model="selectedTimeRange"
              class="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer shadow-inner transition-colors"
              title="Selectează intervalul de sincronizare Sameday"
            >
              <option value="today">Azi</option>
              <option value="24h">24 ore</option>
              <option value="3days">3 zile</option>
              <option value="7days">7 zile</option>
              <option value="30days">30 zile</option>
            </select>

            <button
              @click="syncSamedayData"
              :disabled="syncing"
              class="group flex items-center px-2.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 shadow-sm hover:shadow transition-all disabled:opacity-50"
              :title="`Sincronizează coletele din Sameday API (${getTimeRangeLabel(selectedTimeRange)})`"
            >
              <i v-if="syncing" class="pi pi-spin pi-spinner text-xs shrink-0"></i>
              <i v-else class="pi pi-refresh text-xs shrink-0"></i>
              <span class="max-w-0 opacity-0 group-hover:max-w-28 group-hover:opacity-100 group-hover:ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-[11px]">{{ syncing ? 'Sincronizare...' : 'Sync Sameday' }}</span>
            </button>

            <button
              @click="saveBatchToDb"
              :disabled="products.length === 0 || savingToDb"
              class="group flex items-center px-2 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Salvează sesiunea în Baza de Date"
            >
              <i :class="savingToDb ? 'pi pi-spin pi-spinner text-xs text-red-600 dark:text-red-400' : 'pi pi-cloud-upload text-xs text-red-600 dark:text-red-400'" class="shrink-0"></i>
              <span class="max-w-0 opacity-0 group-hover:max-w-24 group-hover:opacity-100 group-hover:ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-[11px]">{{ savingToDb ? 'Salvare...' : 'Salvează DB' }}</span>
            </button>
          </div>

          <!-- Divider -->
          <div class="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <!-- Secondary Tools Group (Icon-Only with Hover Expand & Tooltips) -->
          <div class="flex items-center gap-0.5 bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
            <!-- Import Excel -->
            <button
              @click="triggerFileInput"
              class="group flex items-center px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all"
              title="Importă colete din fișier Excel (.xlsx)"
            >
              <i class="pi pi-file-import text-xs shrink-0"></i>
              <span class="max-w-0 opacity-0 group-hover:max-w-20 group-hover:opacity-100 group-hover:ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-[11px] font-bold">Import</span>
            </button>

            <!-- Export -->
            <button
              @click="exportData"
              :disabled="products.length === 0"
              class="group flex items-center px-2 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Exportă tabelul în format Excel"
            >
              <i class="pi pi-file-excel text-xs shrink-0"></i>
              <span class="max-w-0 opacity-0 group-hover:max-w-20 group-hover:opacity-100 group-hover:ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-[11px] font-bold">Export</span>
            </button>

            <!-- Live Multi-Device Sync (Connected / Disconnected Dynamic Colors, Dot Removed) -->
            <button
              @click="showPairingModal = true"
              class="group flex items-center px-2 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs"
              :class="liveSyncEnabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
              :title="liveSyncEnabled ? 'Live Sync Conectat (Sincronizare activă)' : 'Live Sync Deconectat / Inactiv (Click pentru conectare)'"
            >
              <i
                class="pi pi-sync text-xs shrink-0"
                :class="liveSyncEnabled ? 'animate-spin' : ''"
                style="animation-duration: 3.5s;"
              ></i>
              <span class="max-w-0 opacity-0 group-hover:max-w-24 group-hover:opacity-100 group-hover:ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-[11px] font-bold">
                {{ liveSyncEnabled ? 'Live Sync' : 'Sync Oprit' }}
              </span>
            </button>

            <!-- Sound Mute/Unmute -->
            <button
              @click="soundEnabled = !soundEnabled; saveDataToLocalStorage('soundEnabled', soundEnabled)"
              class="group flex items-center px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all"
              :class="soundEnabled ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'"
              :title="soundEnabled ? 'Sunet activat (click pentru mut)' : 'Sunet dezactivat (click pentru activare)'"
            >
              <i :class="soundEnabled ? 'pi pi-volume-up text-xs' : 'pi pi-volume-off text-xs'" class="shrink-0"></i>
              <span class="max-w-0 opacity-0 group-hover:max-w-20 group-hover:opacity-100 group-hover:ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-[11px] font-bold">{{ soundEnabled ? 'Sunet On' : 'Sunet Off' }}</span>
            </button>

            <!-- Reset Data -->
            <button
              @click="showClearConfirm = true"
              :disabled="products.length === 0"
              class="group flex items-center px-2 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Șterge / Resetează toate coletele"
            >
              <i class="pi pi-trash text-xs shrink-0"></i>
              <span class="max-w-0 opacity-0 group-hover:max-w-24 group-hover:opacity-100 group-hover:ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-[11px] font-bold">Resetează</span>
            </button>

            <!-- Settings -->
            <button
              @click="showSettingsDrawer = true"
              class="group flex items-center px-2 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all"
              title="Configurare Verificator Sameday"
            >
              <i class="pi pi-cog text-xs shrink-0"></i>
              <span class="max-w-0 opacity-0 group-hover:max-w-20 group-hover:opacity-100 group-hover:ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out text-[11px] font-bold">Setări</span>
            </button>
          </div>

          <!-- View Mode Toggle (Cards vs Table) moved above -->
          <div class="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <button
              @click="viewMode = 'grid'"
              class="p-1.5 rounded-lg text-xs transition-all"
              :class="viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'"
              title="Vizualizare Carduri"
            >
              <i class="pi pi-th-large"></i>
            </button>
            <button
              @click="viewMode = 'table'"
              class="p-1.5 rounded-lg text-xs transition-all"
              :class="viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'"
              title="Vizualizare Tabel"
            >
              <i class="pi pi-list"></i>
            </button>
          </div>

        </div>
      </div>

      <!-- Sleek Horizontal Progress Line running along the bottom edge -->
      <div class="w-full h-1 bg-slate-200/70 dark:bg-slate-800/90 overflow-hidden" :title="`Progres: ${progressPercentage}%`">
        <div
          class="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-300"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Main Workspace Content -->
    <div class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
      
      <!-- Empty State / Sync Banner -->
      <div v-if="products.length === 0" class="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900/70 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4 my-8 shadow-sm max-w-2xl mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center text-3xl shadow-inner">
          <i class="pi pi-truck"></i>
        </div>
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Sincronizare Sameday</h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Apasă butonul de mai jos pentru a prelua comenzile și AWB-urile de astăzi direct prin API-ul Sameday sau încarcă un fișier Excel.
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            @click="syncSamedayData"
            :disabled="syncing"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-md transition-all disabled:opacity-50"
          >
            <i v-if="syncing" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-refresh"></i>
            <span>Sincronizează din Sameday</span>
          </button>
          <button
            @click="triggerFileInput"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <i class="pi pi-upload"></i>
            <span>Încarcă Excel Manual</span>
          </button>
        </div>
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

              <span v-if="product.index" class="w-6 h-6 rounded-full bg-slate-900 dark:bg-red-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shadow-sm">
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
                class="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-500"
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
        <div v-if="viewMode === 'table'" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden w-full">
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
                      :class="product.status === activStatus ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
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
                    <a v-if="product.clientPhone" :href="'tel:' + product.clientPhone" class="hover:text-red-600 dark:hover:text-red-400">
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
                      class="p-1.5 rounded-lg text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
      header="Configurare Verificator Sameday"
      modal
      :style="{ width: '26rem' }"
      :breakpoints="{ '575px': '94vw' }"
    >
      <div class="space-y-3 pt-1">
        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-200">Sufix ignorat la scanare AWB</label>
          <InputText
            v-model="awbEndWith"
            type="text"
            class="w-full text-xs font-mono"
            @change="saveDataToLocalStorage('awbEndWith', awbEndWith)"
          />
          <p class="text-[10px] text-slate-500 dark:text-slate-400">Ex: 001</p>
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-200">Lungime minimă AWB (caractere)</label>
          <InputNumber
            v-model="awbLength"
            class="w-full text-xs"
            @change="saveDataToLocalStorage('awbLength', awbLength)"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-200">Temporizator Auto-Clear input (secunde)</label>
          <InputNumber
            v-model="delayAutoClear"
            class="w-full text-xs"
            @change="saveDataToLocalStorage('delayAutoClear', delayAutoClear)"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-200">Expirare sesiune locală (ore)</label>
          <InputNumber
            v-model="delayClearData"
            class="w-full text-xs"
            @change="saveDataToLocalStorage('delayClearData', delayClearData)"
          />
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200">Semnale sonore scanare</span>
          <InputSwitch v-model="soundEnabled" @change="saveDataToLocalStorage('soundEnabled', soundEnabled)" />
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200 block">Salvare automată în DB</span>
            <span class="text-[9px] text-slate-500 dark:text-slate-400">Sincronizează la fiecare validare</span>
          </div>
          <InputSwitch v-model="autoSaveDb" @change="saveDataToLocalStorage('autoSaveDb', autoSaveDb)" />
        </div>

        <!-- Live Phone <-> Desktop Multi-Device Sync Section -->
        <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[11px] font-bold text-slate-800 dark:text-slate-100 block">Sincronizare Telefon ↔ Desktop</span>
              <span class="text-[9px] text-slate-500 dark:text-slate-400">Scanează de pe telefon și vezi modificările pe desktop</span>
            </div>
            <InputSwitch v-model="liveSyncEnabled" @change="saveDataToLocalStorage('liveSyncEnabled', liveSyncEnabled)" />
          </div>

          <button
            type="button"
            @click="showPairingModal = true"
            class="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <i class="pi pi-qrcode text-xs"></i>
            <span>Conectare Telefon prin QR Code</span>
          </button>
        </div>

        <!-- Collapsible Custom Sound Settings & DB Audio Upload at the end -->
        <div v-if="soundEnabled" class="pt-2.5 border-t border-slate-100 dark:border-slate-800">
          <SoundSettings />
        </div>

        <div class="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
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
      :style="{ width: '22rem' }"
    >
      <div class="space-y-3 pt-1">
        <p class="text-xs text-slate-600 dark:text-slate-300">Sigur dorești să ștergi toate cele {{ products.length }} colete din sesiunea curentă?</p>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button label="Anulează" severity="secondary" text @click="showClearConfirm = false" />
          <Button label="Șterge Tot" severity="danger" @click="clearData(); showClearConfirm = false" />
        </div>
      </div>
    </Dialog>

    <!-- Floating Camera Scanner Trigger for Mobile -->
    <button
      @click="showCameraScanner = true"
      class="fixed bottom-6 right-6 sm:hidden z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
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
import { toast } from 'vue-sonner';
import CameraScannerModal from '@/components/CameraScannerModal.vue';
import DevicePairingModal from '@/components/DevicePairingModal.vue';
import SoundSettings from '@/components/SoundSettings.vue';
import BatchService from '@/services/batch.services';
import LiveSyncService, { type LiveScanEvent } from '@/services/livesync.services';
import soundService from '@/services/sound.services';

import SamedayService from '@/services/sameday.services';
import { useAuthStore, type Integration } from '@/stores/auth';

export default {
  name: "SameDayView",
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
      samedayService: {} as SamedayService,
      authStore: useAuthStore(),
      samedayIntegration: {} as Integration,
      selectedTimeRange: 'today' as 'today' | '24h' | '3days' | '7days' | '30days',
      syncing: false,
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
      toast.success(`AWB #${awb.toUpperCase()} validat!`, {
        description: 'Coletul Sameday a fost marcat ca Pregătit.',
        duration: (delay * 3) * 1000,
      });
    };
    const notifyAWBDouble = (awb: string, count: number) => {
      toast.warning(`AWB #${awb.toUpperCase()} duplicat!`, {
        description: `Acest colet a fost deja scanat (găsit de ${count} ori).`,
        duration: 6000,
      });
    };
    const notifyAWBError = (awb: string) => {
      toast.error(`AWB #${awb.toUpperCase()} inexistent!`, {
        description: 'Acest AWB nu se regăsește în lista Sameday încărcată.',
        duration: 6000,
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
  async mounted() {
    this.authStore.getIntegrations();
    const sameday = this.authStore.getSameday() as Integration;
    if (sameday) {
      this.samedayIntegration = sameday;
      this.samedayService = new SamedayService(this.samedayIntegration.service);
    }

    if (this.$route.query.room) {
      const room = this.$route.query.room as string;
      LiveSyncService.setRoomId(room);
      toast.info(`📱 Dispozitiv conectat la camera live Sameday: ${room}`);
    } else {
      LiveSyncService.initChannel(LiveSyncService.getOrCreateRoomId());
    }

    LiveSyncService.onScanEvent((event: LiveScanEvent) => {
      if (this.liveSyncEnabled && event.type === 'SCAN_AWB' && event.awb) {
        this.handleIncomingLiveScan(event.awb);
      }
    });
  },
  methods: {
    getTimeRangeLabel(range: string): string {
      switch (range) {
        case 'today': return 'Azi';
        case '24h': return 'Ultimele 24 ore';
        case '3days': return 'Ultimele 3 zile';
        case '7days': return 'Ultimele 7 zile';
        case '30days': return 'Ultimele 30 zile';
        default: return range;
      }
    },
    async syncSamedayData() {
      if (!this.samedayIntegration || !this.samedayIntegration.service) {
        toast.warning("Vă rugăm să configurați credențialele Sameday în secțiunea Integrări!");
        return;
      }

      this.syncing = true;
      try {
        this.samedayService.setConfig(this.samedayIntegration.service);
        const result = await this.samedayService.getData(this.selectedTimeRange);
        if (result && Array.isArray(result) && result.length > 0) {
          const values = result.map((item: any, idx: number) => ({
            id: idx + Date.now(),
            awb: (item.awbNumber || item.awb || '').toString().trim(),
            date: item.date || new Date().toLocaleDateString('ro-RO'),
            status: item.status && item.status === this.activStatus ? this.activStatus : this.inactivStatus,
            clientName: item.clientName || item.recipientName || '',
            clientPhone: item.clientPhone || item.recipientPhone || '',
            observations: item.observation || item.observations || '',
            county: item.county || '',
            city: item.city || '',
            index: "",
          })).filter((item: any) => item.awb.length > 0);

          this.products = values;
          this.sortByStatus(this.products);
          this.countActive = this.products.filter(p => p.status === this.activStatus).length;
          this.saveToLocalStorage(this.products);
          toast.success(`Au fost sincronizate ${values.length} colete din Sameday!`, {
            description: `Interval selectat: ${this.getTimeRangeLabel(this.selectedTimeRange)}`
          });
        } else {
          toast.info(`Niciun colet găsit pentru intervalul "${this.getTimeRangeLabel(this.selectedTimeRange)}".`, {
            description: `Sfat: Schimbă intervalul la "24 ore" sau "7 zile" dacă AWB-urile au fost create anterior.`
          });
        }
      } catch (err) {
        console.error("Sameday sync error:", err);
        toast.error("Eroare la comunicarea cu serverul Sameday. Verificați conexiunea și datele de autentificare.");
      } finally {
        this.syncing = false;
      }
    },
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
          source: 'sameday',
          courier: 'Sameday',
          products: products
        });
      }
    },
    async saveBatchToDb() {
      if (this.products.length === 0) return;
      this.savingToDb = true;
      try {
        const res = await BatchService.saveBatch({
          source: 'sameday',
          courier: 'Sameday',
          products: this.products
        });
        if (res.inDb) {
          toast.success("Coletele Sameday au fost salvate în baza de date PocketBase!");
        } else {
          toast.success("Sesiunea Sameday a fost sincronizată în arhiva permanentă!");
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
      XLSX.utils.book_append_sheet(wb, ws, 'Sameday Verificate');
      XLSX.writeFile(wb, `sameday-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
    },
    clearAwbInput() {
      clearTimeout(this.timeout);
      this.searchQueryAWB = '';
      this.activSearch = false;
      this.$nextTick(() => {
        const el = this.$refs.barcodeInput as HTMLInputElement | undefined;
        if (el) el.focus();
      });
    },
    clearClientSearch() {
      this.searchQuery = '';
      this.$nextTick(() => {
        const el = this.$refs.clientSearchInput as HTMLInputElement | undefined;
        if (el) el.focus();
      });
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