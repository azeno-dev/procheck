<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
    <div class="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div class="w-20 h-20 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-3xl font-mono font-extrabold shadow-inner">
        500
      </div>
      <div class="space-y-2">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Eroare Internă de Server</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          A apărut o problemă neașteptată în timpul procesării cererii. Te rugăm să încerci din nou.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          @click="reloadPage"
          class="inline-flex items-center justify-center gap-2 flex-1 py-3 px-5 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all"
        >
          <i class="pi pi-refresh"></i>
          <span>Reîncarcă Pagina</span>
        </button>
        <router-link
          to="/"
          class="inline-flex items-center justify-center gap-2 flex-1 py-3 px-5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <i class="pi pi-home"></i>
          <span>Acasă</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Page500",
  methods: {
    reloadPage() {
      window.location.reload();
    }
  }
};
</script>
