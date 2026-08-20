<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
      <!-- Background Glow Highlights -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/3 right-10 w-[400px] h-[400px] bg-primary-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Hero Left Column: Headline & CTA -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider animate-pulse-subtle">
              <span class="w-2 h-2 rounded-full bg-brand-400"></span>
              Soluția #1 de Verificare AWB & Expedieri
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Scanare Rapidă & Verificare Coletărie <span class="bg-gradient-to-r from-brand-400 via-primary-300 to-indigo-300 bg-clip-text text-transparent">Fără Erori</span>
            </h1>

            <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Automatizează validarea coletelor la împachetare. Elimină expedierile greșite, detectează AWB-urile dublate și sincronizează instant statusurile prin cititor de coduri de bare și Excel.
            </p>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <router-link to="/integrations/import" class="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 via-primary-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-glow-primary transition-all duration-200 flex items-center justify-center gap-2 text-base">
                <i class="pi pi-play"></i>
                <span>Deschide Verificatorul</span>
              </router-link>

              <router-link to="/contact" class="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:text-white transition-all flex items-center justify-center gap-2 text-base">
                <i class="pi pi-envelope"></i>
                <span>Solicită Demo Live</span>
              </router-link>
            </div>

            <!-- Trust badges -->
            <div class="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <span class="flex items-center gap-1.5"><i class="pi pi-check-circle text-emerald-400"></i> Fără instalare software</span>
              <span class="flex items-center gap-1.5"><i class="pi pi-check-circle text-emerald-400"></i> Compatibil cu orice cititor USB/Bluetooth</span>
              <span class="flex items-center gap-1.5"><i class="pi pi-check-circle text-emerald-400"></i> Import/Export Excel instant</span>
            </div>
          </div>

          <!-- Hero Right Column: Interactive Scanner Simulator Card -->
          <div class="lg:col-span-5">
            <div class="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative">
              <div class="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span class="text-xs font-mono text-slate-400 ml-2">scanner-demo.exe</span>
                </div>
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Preview
                </span>
              </div>

              <!-- Barcode scan interactive input -->
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Simulează scanarea unui cod de bare:</label>
                  <div class="relative flex items-center">
                    <i class="pi pi-barcode absolute left-3.5 text-brand-400 text-lg"></i>
                    <input v-model="demoAwbInput" @keyup.enter="simulateScan" type="text" placeholder="Tastează sau apasă Scanează..." class="w-full bg-slate-900 border border-slate-600 rounded-xl pl-10 pr-24 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono tracking-wider">
                    <button @click="simulateScan" class="absolute right-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg transition-colors">
                      Scanează
                    </button>
                  </div>
                </div>

                <!-- Live Feed list -->
                <div class="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-2 max-h-56 overflow-y-auto">
                  <div v-for="(item, idx) in demoList" :key="idx" class="flex items-center justify-between p-2.5 rounded-lg border transition-all duration-300" :class="item.scanned ? 'bg-emerald-950/40 border-emerald-700/60' : 'bg-slate-800/60 border-slate-700/40'">
                    <div class="flex items-center gap-3">
                      <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" :class="item.scanned ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'">
                        <i v-if="item.scanned" class="pi pi-check text-xs"></i>
                        <span v-else>{{ idx + 1 }}</span>
                      </div>
                      <div>
                        <p class="text-xs font-mono font-semibold text-white">{{ item.awb }}</p>
                        <p class="text-[11px] text-slate-400">{{ item.client }} &bull; {{ item.city }}</p>
                      </div>
                    </div>
                    <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full" :class="item.scanned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'">
                      {{ item.scanned ? 'Pregătit' : 'În așteptare' }}
                    </span>
                  </div>
                </div>

                <!-- Stats summary -->
                <div class="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div class="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <p class="text-slate-400">Total</p>
                    <p class="text-base font-bold text-white">{{ demoList.length }}</p>
                  </div>
                  <div class="bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/40">
                    <p class="text-emerald-400">Verificate</p>
                    <p class="text-base font-bold text-emerald-400">{{ demoScannedCount }}</p>
                  </div>
                  <div class="bg-rose-950/30 p-2 rounded-lg border border-rose-900/40">
                    <p class="text-rose-400">Rămase</p>
                    <p class="text-base font-bold text-rose-400">{{ demoList.length - demoScannedCount }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Key Metrics Ribbon -->
    <section class="bg-white border-y border-slate-200 py-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div class="pt-4 md:pt-0">
            <p class="text-3xl lg:text-4xl font-extrabold text-brand-600">99.98%</p>
            <p class="text-sm font-medium text-slate-600 mt-1">Acuratețe Expediere Coletărie</p>
          </div>
          <div class="pt-4 md:pt-0">
            <p class="text-3xl lg:text-4xl font-extrabold text-primary-600">3x</p>
            <p class="text-sm font-medium text-slate-600 mt-1">Viteză Crescută de Ambalare</p>
          </div>
          <div class="pt-4 md:pt-0">
            <p class="text-3xl lg:text-4xl font-extrabold text-emerald-600">&lt; 0.2s</p>
            <p class="text-sm font-medium text-slate-600 mt-1">Timp Răspuns per Scanare</p>
          </div>
          <div class="pt-4 md:pt-0">
            <p class="text-3xl lg:text-4xl font-extrabold text-indigo-600">500.000+</p>
            <p class="text-sm font-medium text-slate-600 mt-1">AWB-uri Verificate cu Succes</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 md:py-28 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
            Eficiență Fără Compromis
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tot ce ai nevoie pentru ambalare și verificare fără cusur
          </h2>
          <p class="text-base sm:text-lg text-slate-600">
            Platforma ProCheck este proiectată special pentru depozite, magazine online și operatori logistici.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-200">
              <i class="pi pi-barcode"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Scanare Barcode Ultrarapidă</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Scanează mii de etichete succesiv fără blocaje. Câmpul de căutare se re-focusează și se curăță automat conform setărilor tale.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
              <i class="pi pi-volume-up"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Feedback Audio Instant</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Semnale audio clare și distincte pentru colet găsit cu succes, avertisment la colet deja scanat (dublat) sau eroare colet inexistent.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-200">
              <i class="pi pi-file-excel"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Import & Export Excel (XLSX)</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Trage și plasează fișierul generat din platforma de curierat sau ERP. Exportă raportul final cu starea fiecărui colet la sfârșitul zilei.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
              <i class="pi pi-truck"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Sincronizare Sameday API</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Conectare directă prin cheie API pentru a prelua comenzile din platforma Sameday și a actualiza automat statusurile.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-200">
              <i class="pi pi-shield"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Prevenire Erori & Colete Dublate</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Sistemul avertizează imediat dacă un colet a fost scanat anterior sau dacă există discrepanțe între comanda clientului și AWB.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-200">
              <i class="pi pi-mobile"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">100% Responsiv Desktop & Mobil</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Funcționează impecabil atât pe monitoare mari de depozit, cât și pe tablete industriale sau telefoane mobile cu scanner integrat.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how" class="py-20 md:py-28 bg-white border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Flux de Lucru Simplificat
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cum funcționează ProCheck în 3 pași
          </h2>
          <p class="text-base sm:text-lg text-slate-600">
            Economisește până la 2 ore zilnic per stație de ambalare.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <!-- Step 1 -->
          <div class="relative bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center space-y-4">
            <div class="w-14 h-14 rounded-full bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-glow-primary">
              1
            </div>
            <h3 class="text-xl font-bold text-slate-900">Încarcă AWB-urile</h3>
            <p class="text-sm text-slate-600">
              Importă fișierul Excel descărcat din aplicația de curierat sau apasă butonul de sincronizare automată Sameday.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="relative bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center space-y-4">
            <div class="w-14 h-14 rounded-full bg-primary-600 text-white font-extrabold text-xl flex items-center justify-center shadow-glow-primary">
              2
            </div>
            <h3 class="text-xl font-bold text-slate-900">Scanează Coletele</h3>
            <p class="text-sm text-slate-600">
              Folosește cititorul de coduri de bare la împachetare. AWB-urile se marchează instant ca „Pregătit” cu sunet de confirmare.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="relative bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col items-center text-center space-y-4">
            <div class="w-14 h-14 rounded-full bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-glow-emerald">
              3
            </div>
            <h3 class="text-xl font-bold text-slate-900">Validează & Exportă</h3>
            <p class="text-sm text-slate-600">
              Verifică dintr-o privire coletele rămase nepregătite și exportă lista actualizată către curier sau depozit.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
            Planuri Accesibile
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Alege planul potrivit pentru volumul tău
          </h2>
          <p class="text-base sm:text-lg text-slate-600">
            Toate planurile includ asistență tehnică și actualizări continue.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          <!-- Plan Start -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div class="space-y-4">
              <h3 class="text-xl font-bold text-slate-900">Start</h3>
              <p class="text-sm text-slate-500">Pentru magazine mici și afaceri la început.</p>
              <div class="pt-2">
                <span class="text-4xl font-extrabold text-slate-900">49 lei</span>
                <span class="text-slate-500 text-sm"> / lună</span>
              </div>
              <ul class="space-y-3 pt-4 text-sm text-slate-600">
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Până la 1.000 AWB-uri / lună</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Import & Export Excel XLSX</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Scanare & semnale audio</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Suport prin Email</li>
              </ul>
            </div>
            <router-link to="/contact" class="mt-8 block text-center px-4 py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
              Alege Start
            </router-link>
          </div>

          <!-- Plan Pro (Highlighted) -->
          <div class="bg-gradient-to-b from-slate-900 to-slate-950 p-8 rounded-2xl border-2 border-brand-500 shadow-2xl text-white flex flex-col justify-between relative">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-primary-500 text-white text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
              Cel mai popular
            </div>
            <div class="space-y-4">
              <h3 class="text-xl font-bold text-white">Pro</h3>
              <p class="text-sm text-slate-400">Pentru magazine în creștere cu flux zilnic de comenzi.</p>
              <div class="pt-2">
                <span class="text-4xl font-extrabold text-white">99 lei</span>
                <span class="text-slate-400 text-sm"> / lună</span>
              </div>
              <ul class="space-y-3 pt-4 text-sm text-slate-300">
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-400"></i> AWB-uri nelimitate</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-400"></i> Integrare API Sameday Live</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-400"></i> Import/Export Excel fără limită</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-400"></i> Mod tabel & Mod carduri</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-400"></i> Suport prioritar 24/7</li>
              </ul>
            </div>
            <router-link to="/contact" class="mt-8 block text-center px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-primary-600 hover:from-brand-500 hover:to-primary-500 shadow-glow-primary transition-all">
              Alege Pro
            </router-link>
          </div>

          <!-- Plan Business / Enterprise -->
          <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div class="space-y-4">
              <h3 class="text-xl font-bold text-slate-900">Enterprise</h3>
              <p class="text-sm text-slate-500">Pentru centre logistice, depozite mari și 3PL.</p>
              <div class="pt-2">
                <span class="text-4xl font-extrabold text-slate-900">Personalizat</span>
              </div>
              <ul class="space-y-3 pt-4 text-sm text-slate-600">
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Multi-depozit & Utilizatori multipli</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Integrări ERP / WMS la comandă</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> SLA dedicat & Account manager</li>
                <li class="flex items-center gap-2"><i class="pi pi-check text-emerald-500"></i> Server privat & Custom branding</li>
              </ul>
            </div>
            <router-link to="/contact" class="mt-8 block text-center px-4 py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
              Contactează-ne
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-brand-700 via-primary-700 to-indigo-800 text-white text-center">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Pregătit să elimini erorile de expediere?
        </h2>
        <p class="text-base sm:text-lg text-brand-100 max-w-2xl mx-auto font-light">
          Alătură-te magazinelor online care economisesc timp și oferă clienților o experiență de livrare impecabilă.
        </p>
        <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link to="/integrations/import" class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-brand-900 bg-white hover:bg-slate-100 shadow-xl transition-all">
            Testează Acum Verificatorul
          </router-link>
          <router-link to="/contact" class="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-brand-900/60 hover:bg-brand-900 border border-brand-400/40 transition-all">
            Discută cu un Specialist
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  name: "HomePage",
  data() {
    return {
      demoAwbInput: "",
      demoList: [
        { awb: "12345678901001", client: "Popescu Ion", city: "București", scanned: true },
        { awb: "12345678902001", client: "Ionescu Maria", city: "Cluj-Napoca", scanned: false },
        { awb: "12345678903001", client: "Radu Andrei", city: "Timișoara", scanned: false },
        { awb: "12345678904001", client: "Elena Dumitru", city: "Iași", scanned: false },
      ]
    };
  },
  computed: {
    demoScannedCount(): number {
      return this.demoList.filter(item => item.scanned).length;
    }
  },
  methods: {
    simulateScan() {
      const input = this.demoAwbInput.trim().toLowerCase();
      if (!input) {
        // scan next unscanned item
        const next = this.demoList.find(i => !i.scanned);
        if (next) {
          next.scanned = true;
        } else {
          this.demoList.forEach(i => i.scanned = false);
        }
        return;
      }

      const match = this.demoList.find(i => i.awb.toLowerCase().includes(input));
      if (match) {
        match.scanned = true;
      }
      this.demoAwbInput = "";
    }
  }
};
</script>