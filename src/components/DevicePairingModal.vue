<template>
  <Dialog
    v-model:visible="visible"
    @hide="onClose"
    modal
    header="Sincronizare Telefon ↔ Desktop"
    :style="{ width: '29rem' }"
    :breakpoints="{ '575px': '94vw' }"
  >
    <div class="space-y-3.5 pt-1">
      <!-- Status Banner -->
      <div class="flex items-center justify-between p-2.5 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
            <i class="pi pi-sync text-xs animate-spin" style="animation-duration: 4s;"></i>
          </div>
          <div>
            <p class="text-[11px] font-bold text-indigo-950 dark:text-indigo-200">Conexiune Live Activă</p>
            <p class="text-[10px] text-indigo-700 dark:text-indigo-300">Scanează de pe telefon și vezi modificările pe desktop</p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Conectat
        </span>
      </div>

      <!-- QR Code & Quick Pairing -->
      <div class="flex flex-col sm:flex-row items-center gap-3.5 p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div class="bg-white p-2 rounded-lg border border-slate-200 shadow-xs shrink-0">
          <qrcode-vue
            :value="pairingUrl"
            :size="105"
            level="M"
            render-as="svg"
          />
        </div>

        <div class="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
          <p class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Scanează codul QR cu camera telefonului</p>
          <p class="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
            Deschide camera sau browserul pe mobil pentru a intra în sesiunea sincronizată.
          </p>

          <div class="pt-0.5">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cod Sală:</span>
            <div class="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px] mt-0.5">
              <span>{{ roomId }}</span>
              <button @click="copyRoomUrl" class="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400" title="Copiază linkul">
                <i class="pi pi-copy text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Device Mode Switcher -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300">Rol Dispozitiv Curent</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="deviceMode = 'desktop'; saveMode()"
            class="p-2.5 rounded-xl border text-left transition-all"
            :class="deviceMode === 'desktop' ? 'bg-brand-50/70 dark:bg-brand-950/60 border-brand-300 dark:border-brand-600 ring-1 ring-brand-500/20 text-brand-900 dark:text-brand-200' : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            <div class="flex items-center gap-1.5 font-bold text-[11px]">
              <i class="pi pi-desktop text-xs text-brand-600 dark:text-brand-400"></i>
              <span>Ecran Desktop</span>
            </div>
            <p class="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Primește scanările și actualizează ecranul</p>
          </button>

          <button
            type="button"
            @click="deviceMode = 'mobile'; saveMode()"
            class="p-2.5 rounded-xl border text-left transition-all"
            :class="deviceMode === 'mobile' ? 'bg-brand-50/70 dark:bg-brand-950/60 border-brand-300 dark:border-brand-600 ring-1 ring-brand-500/20 text-brand-900 dark:text-brand-200' : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            <div class="flex items-center gap-1.5 font-bold text-[11px]">
              <i class="pi pi-mobile text-xs text-brand-600 dark:text-brand-400"></i>
              <span>Scaner Telefon</span>
            </div>
            <p class="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Trimite automat codurile pe desktop</p>
          </button>
        </div>
      </div>

      <!-- Quick Test & Footer -->
      <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          type="button"
          @click="testSimulatedScan"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/80 transition-colors"
        >
          <i class="pi pi-play text-[9px]"></i>
          <span>Testează Scan Live</span>
        </button>

        <Button label="Închide" severity="secondary" @click="onClose" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import QrcodeVue from 'qrcode.vue';
import LiveSyncService from '@/services/livesync.services';
import { toast } from 'vue-sonner';

export default {
  name: "DevicePairingModal",
  components: {
    QrcodeVue,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    currentAwbList: {
      type: Array,
      default: () => [],
    }
  },
  emits: ["update:modelValue", "simulate-scan"],
  data() {
    return {
      roomId: '',
      deviceMode: 'desktop' as 'desktop' | 'mobile',
    };
  },
  computed: {
    visible: {
      get(): boolean {
        return this.modelValue;
      },
      set(val: boolean) {
        this.$emit("update:modelValue", val);
      }
    },
    pairingUrl(): string {
      const origin = window.location.origin;
      const path = this.$route.path;
      return `${origin}${path}?room=${this.roomId}`;
    }
  },
  created() {
    this.roomId = LiveSyncService.getOrCreateRoomId();
    const savedMode = localStorage.getItem('procheck_device_mode');
    if (savedMode === 'mobile' || savedMode === 'desktop') {
      this.deviceMode = savedMode;
    }
  },
  methods: {
    saveMode() {
      localStorage.setItem('procheck_device_mode', this.deviceMode);
      toast.info(`Mod dispozitiv setat la: ${this.deviceMode === 'desktop' ? 'Ecran Desktop' : 'Scaner Telefon'}`);
    },
    copyRoomUrl() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.pairingUrl);
        toast.success("Linkul de sincronizare a fost copiat în clipboard!");
      }
    },
    testSimulatedScan() {
      if (this.currentAwbList && this.currentAwbList.length > 0) {
        // Pick first pending or first AWB
        const target: any = this.currentAwbList.find((p: any) => p.status !== 'Pregatit') || this.currentAwbList[0];
        if (target && target.awb) {
          LiveSyncService.broadcastScan(target.awb, 'Pregatit', target, 'mobile');
          toast.success(`Semnal scanare trimis pentru AWB: ${target.awb}`);
          this.$emit('simulate-scan', target.awb);
          return;
        }
      }
      LiveSyncService.broadcastScan('DEMO1234567890', 'Pregatit');
      toast.success("Semnal scanare demonstrativ trimis!");
    },
    onClose() {
      this.visible = false;
    }
  }
};
</script>
