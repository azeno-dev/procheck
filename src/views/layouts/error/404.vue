<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
    <div class="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div class="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto text-3xl font-mono font-extrabold shadow-inner">
        404
      </div>
      <div class="space-y-2">
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Pagina nu a fost găsită</h1>
        <p class="text-sm text-slate-500">
          Ne pare rău, pagina pe care o cauți nu există sau a fost mutată.
        </p>
      </div>
      <router-link
        to="/"
        class="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all"
      >
        <i class="pi pi-home"></i>
        <span>Reveniți la Pagina Principală</span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Page404"
};
</script>