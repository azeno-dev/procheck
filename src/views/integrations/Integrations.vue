<template>
  <div class="py-8 md:py-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[calc(100vh-4rem)] transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Top Banner -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div class="space-y-1">
          <span class="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 px-3 py-0.5 rounded-full shadow-xs">
            Hub Conexiuni & Curieri
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Integrări Disponibile
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Configurează conexiunile API cu platformele de curierat și sincronizează automat AWB-urile generate pentru procesare rapidă.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <router-link
            to="/integrations/import"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-md hover:shadow-lg transition-all"
          >
            <i class="pi pi-file-import"></i>
            <span>Verificare Import (Excel)</span>
          </router-link>
        </div>
      </div>

      <!-- Integrations Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <IntegrationCard
          v-for="integration in allIntegrations"
          :key="integration.id"
          :imageUrl="integration.image_url || ''"
          :active="integration.active"
          :service="integration.service"
          :doc="integration.doc || ''"
          :site_url="integration.site_url || ''"
        />
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore, type Integration } from '@/stores/auth';
import IntegrationCard from "@/components/IntegrationCard.vue";

export default {
  name: "IntegrationsPage",
  components: {
    IntegrationCard
  },
  data() {
    return {
      authStore: useAuthStore(),
      integrations: [] as Integration[],
      defaultIntegrations: [
        {
          id: "sameday",
          name: "Sameday Curier",
          active: true,
          type: "sameday",
          image_url: "https://sameday.ro/app/themes/samedaytwo/public/images/logo/logo-sameday.svg",
          site_url: "https://sameday.ro",
          service: {
            name: "Sameday Curier",
            api_url: "https://api.sameday.ro",
            user: "",
            password: ""
          },
          doc: "<p>Pentru a activa integrarea Sameday, introduceți utilizatorul și parola furnizate de reprezentantul Sameday pentru acces la API-ul de sincronizare a statusurilor.</p>"
        }
      ]
    };
  },
  computed: {
    allIntegrations(): Integration[] {
      if (this.integrations && this.integrations.length > 0) {
        return this.integrations;
      }
      return this.defaultIntegrations as any;
    }
  },
  async mounted() {
    if (this.authStore.user) {
      await this.authStore.getUser();
    }

    if (this.authStore && this.authStore.user) {
      this.integrations = this.authStore.integrations || [];
    }
  }
};
</script>