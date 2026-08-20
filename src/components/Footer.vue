<template>
  <footer class="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand column -->
        <div class="md:col-span-2 space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-primary-400 flex items-center justify-center text-white shadow-glow-primary">
              <i class="pi pi-barcode text-lg"></i>
            </div>
            <span class="text-xl font-bold text-white tracking-tight">Pro<span class="text-brand-400">Check</span></span>
          </div>
          <p class="text-sm text-slate-400 max-w-sm">
            Platformă inteligentă de verificare, scanare și sincronizare AWB-uri și colete în timp real pentru e-commerce și depozite.
          </p>
          <div class="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-full px-3 py-1 w-fit">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Server Online &bull; v{{ version }}</span>
          </div>
        </div>

        <!-- Links column -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">Navigare</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/" class="hover:text-white transition-colors">Acasă</router-link></li>
            <li><router-link to="/integrations" class="hover:text-white transition-colors">Integrări Curieri</router-link></li>
            <li><router-link to="/integrations/import" class="hover:text-white transition-colors">Verificare Import</router-link></li>
            <li><router-link to="/help" class="hover:text-white transition-colors">Centru de Ajutor</router-link></li>
          </ul>
        </div>

        <!-- Contact column -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">Suport & Contact</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/contact" class="hover:text-white transition-colors">Contactați-ne</router-link></li>
            <li><a href="mailto:contact@azeno.ro" class="hover:text-white transition-colors">contact@azeno.ro</a></li>
            <li><a href="https://azeno.ro" target="_blank" rel="noopener" class="text-brand-400 hover:text-brand-300 transition-colors">Powered by Azeno &rarr;</a></li>
          </ul>
        </div>
      </div>

      <div class="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>&copy; {{ (new Date()).getFullYear() }} ProCheck. Toate drepturile rezervate.</p>
        <p class="flex items-center gap-1">
          Dezvoltat cu precizie de <a href="https://azeno.ro" target="_blank" rel="noopener" class="text-slate-400 hover:text-white font-medium underline underline-offset-2">Azeno</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { version } from "../../package.json";

export default {
  name: "AppFooter",
  data() {
    return {
      version: version
    }
  }
};
</script>

