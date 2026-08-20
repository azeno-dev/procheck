<template>
  <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-card-hover transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden group">
    <!-- Top Bar: Flag & Options -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          România
        </span>
      </div>

      <div>
        <button
          @click="onMoreClick($event)"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Opțiuni"
        >
          <i class="pi pi-ellipsis-v text-sm"></i>
        </button>
        <Menu ref="menu" :model="items" :popup="true" />
      </div>
    </div>

    <!-- Center Logo & Name -->
    <div class="flex flex-col items-center justify-center py-6 text-center">
      <div class="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 mb-3 group-hover:scale-105 transition-transform duration-200 shadow-inner">
        <img
          :src="imageUrl || 'https://sameday.ro/app/themes/samedaytwo/public/images/logo/logo-sameday.svg'"
          alt="Integration Logo"
          class="max-h-12 max-w-full object-contain"
        />
      </div>
      <h3 class="text-lg font-bold text-slate-900 capitalize">{{ service?.name || 'Sameday Curier' }}</h3>
      <p class="text-xs text-slate-500 mt-1">Sincronizare automată AWB & Colete</p>
    </div>

    <!-- Bottom Bar: Status & Edit Button -->
    <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <span
          class="w-2 h-2 rounded-full"
          :class="active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'"
        ></span>
        <span
          class="text-xs font-semibold"
          :class="active ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full' : 'text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full'"
        >
          {{ active ? 'Conectat' : 'Neconfigurat' }}
        </span>
      </div>

      <button
        @click="onEditClick"
        class="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-500 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
      >
        <i class="pi pi-pencil text-xs"></i>
        <span>Configurează</span>
      </button>
    </div>
  </div>

  <!-- Documentation Dialog -->
  <Dialog
    v-model:visible="showDocDialog"
    @close="showDocDialog = false"
    maximizable
    modal
    header="Ghid de Integrare"
    :style="{ width: '45rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '92vw' }"
  >
    <div class="prose prose-sm max-w-none text-slate-700 p-2" v-html="doc || '<p>Documentația pentru această integrare va fi disponibilă în curând.</p>'"></div>
  </Dialog>

  <!-- Edit Credentials Dialog -->
  <Dialog
    v-model:visible="showEditDialog"
    @close="showEditDialog = false"
    header="Configurare Conexiune API"
    modal
    :style="{ width: '28rem' }"
    :breakpoints="{ '575px': '92vw' }"
  >
    <div class="space-y-4 pt-2">
      <p class="text-xs text-slate-500">Introduceți credențialele furnizate de curier pentru sincronizare automată.</p>

      <div class="space-y-1">
        <label for="api_url" class="block text-xs font-semibold text-slate-700">API URL</label>
        <InputText
          id="api_url"
          type="text"
          :value="service.api_url || 'https://api.sameday.ro'"
          class="w-full bg-slate-100 text-slate-500 text-sm"
          readonly
          disabled
        />
      </div>

      <div class="space-y-1">
        <label for="user" class="block text-xs font-semibold text-slate-700">Utilizator API</label>
        <InputText
          id="user"
          type="text"
          v-model="editUser"
          placeholder="ex: user_sameday"
          class="w-full text-sm"
          autocomplete="off"
        />
      </div>

      <div class="space-y-1">
        <label for="password" class="block text-xs font-semibold text-slate-700">Parolă API</label>
        <InputGroup>
          <InputText
            id="password"
            :type="passwordFieldType"
            v-model="editPassword"
            placeholder="••••••••"
            class="text-sm font-mono"
            autocomplete="off"
          />
          <InputGroupAddon @click="togglePasswordVisibility" class="cursor-pointer">
            <i :class="passwordFieldType === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
        <Button type="button" label="Anulează" severity="secondary" text @click="showEditDialog = false" />
        <Button type="button" label="Salvează Datele" @click="onSaveServiceClick" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import ApiService from '@/services/api.services';

const apiService: ApiService = new ApiService();

export default {
  name: "IntegrationCard",
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    },
    service: {
      type: Object,
      default: () => ({})
    },
    doc: {
      type: String,
      default: ''
    },
    site_url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showDocDialog: false,
      showEditDialog: false,
      editUser: this.service?.user || '',
      editPassword: this.service?.password || '',
      passwordFieldType: 'password',
      items: [
        {
          label: "Documentație API",
          icon: "pi pi-book",
          command: () => this.setShowDocDialog()
        },
        {
          label: "Portal Curier",
          icon: "pi pi-external-link",
          command: () => {
            if (this.site_url) window.open(this.site_url, '_blank');
          }
        }
      ],
    };
  },
  methods: {
    onMoreClick(event: any) {
      if (this.$refs.menu) {
        (this.$refs.menu as any).toggle(event);
      }
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    setShowDocDialog() {
      this.showDocDialog = true;
    },
    onEditClick() {
      this.editUser = this.service?.user || '';
      this.editPassword = this.service?.password || '';
      this.showEditDialog = true;
    },
    async onSaveServiceClick() {
      if (this.service) {
        this.service.user = this.editUser;
        this.service.password = this.editPassword;
        await apiService.saveIntegration(this.service);
      }
      this.showEditDialog = false;
    }
  }
};
</script>

