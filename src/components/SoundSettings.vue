<template>
  <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden transition-all">
    <!-- Collapsible Header Accordion Trigger -->
    <button
      type="button"
      @click="isExpanded = !isExpanded"
      class="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors group"
      :aria-expanded="isExpanded"
    >
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs shadow-xs">
          <i class="pi pi-volume-up"></i>
        </div>
        <div>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200 block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            Sunete Personalizate & Bază de Date
          </span>
          <span class="text-[10px] text-slate-500 dark:text-slate-400">
            {{ customCount > 0 ? `${customCount} sunet(e) salvate în DB` : 'Toate sunetele folosesc implicitul din Web' }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span
          class="text-[10px] font-bold px-2 py-0.5 rounded-full"
          :class="customCount > 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
        >
          {{ customCount > 0 ? 'DB Custom' : 'Web Default' }}
        </span>
        <i
          class="pi text-xs text-slate-400 transition-transform duration-200"
          :class="isExpanded ? 'pi-chevron-up rotate-0' : 'pi-chevron-down'"
        ></i>
      </div>
    </button>

    <!-- Expanded Sound Cards Panel -->
    <transition name="slide-up">
      <div v-if="isExpanded" class="p-3.5 pt-1 space-y-2.5 border-t border-slate-200/60 dark:border-slate-800">
        <p class="text-[11px] text-slate-500 dark:text-slate-400 pb-1">
          Încarcă fișiere audio (.mp3, .wav) în Baza de Date pentru echipa ta. Dacă nu încarci un sunet, se va folosi automat cel implicit din Web.
        </p>

        <div
          v-for="sound in soundConfigs"
          :key="sound.type"
          class="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-2 shadow-xs transition-all"
        >
          <!-- Top: Label, Status Badge & Play button -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                :class="getTypeBadgeClass(sound.type)"
              >
                <i :class="getTypeIcon(sound.type)"></i>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{{ sound.label }}</p>
                <span class="text-[10px]" :class="sound.isCustom ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'">
                  {{ sound.isCustom ? `Personalizat (${sound.fileName || 'DB'})` : 'Implicit (Web)' }}
                </span>
              </div>
            </div>

            <!-- Actions: Play Preview & Reset -->
            <div class="flex items-center gap-1">
              <!-- Test Play Button -->
              <button
                type="button"
                @click="testSound(sound.type)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 shadow-sm transition-all"
                title="Ascultă sunetul curent"
              >
                <i class="pi pi-play text-[10px]"></i>
                <span>Test</span>
              </button>

              <!-- Reset to Web Default -->
              <button
                v-if="sound.isCustom"
                type="button"
                @click="resetSound(sound.type)"
                class="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                title="Resetează la sunetul Web implicit"
              >
                <i class="pi pi-refresh text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Bottom: Description & Upload Button -->
          <div class="flex items-center justify-between pt-1 text-[11px]">
            <span class="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[180px]">
              {{ sound.description }}
            </span>

            <label
              :for="`upload-sound-${sound.type}`"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800/80 cursor-pointer transition-all"
            >
              <i class="pi pi-upload text-[10px]"></i>
              <span>{{ sound.isCustom ? 'Schimbă Sunet' : 'Încarcă în DB' }}</span>
              <input
                :id="`upload-sound-${sound.type}`"
                type="file"
                accept="audio/*"
                class="hidden"
                @change="(e) => handleSoundUpload(sound.type, e)"
              />
            </label>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import soundService, { type SoundType, type SoundConfig } from '@/services/sound.services';
import { toast } from 'vue-sonner';

export default {
  name: "SoundSettings",
  data() {
    return {
      isExpanded: false,
      soundConfigs: [] as SoundConfig[],
    };
  },
  computed: {
    customCount(): number {
      return this.soundConfigs.filter(s => s.isCustom).length;
    }
  },
  created() {
    this.refreshConfigs();
  },
  methods: {
    refreshConfigs() {
      this.soundConfigs = soundService.getSoundConfigs();
    },
    testSound(type: SoundType) {
      soundService.playSound(type, true);
    },
    async handleSoundUpload(type: SoundType, event: Event) {
      const target = event.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;

      const file = target.files[0];
      try {
        const result = await soundService.uploadSound(type, file);
        this.refreshConfigs();
        toast.success(`Sunetul pentru "${type.toUpperCase()}" a fost salvat ${result.inDb ? 'în Baza de Date' : 'local'}!`);
        soundService.playSound(type, true);
      } catch (err) {
        console.error("Upload sound error:", err);
        toast.error("Eroare la încărcarea fișierului audio.");
      } finally {
        target.value = '';
      }
    },
    async resetSound(type: SoundType) {
      await soundService.resetToDefault(type);
      this.refreshConfigs();
      toast.info(`Sunetul a fost resetat la versiunea Web implicită.`);
      soundService.playSound(type, true);
    },
    getTypeBadgeClass(type: SoundType): string {
      switch (type) {
        case 'success':
          return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300';
        case 'warning':
          return 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300';
        case 'error':
          return 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300';
      }
    },
    getTypeIcon(type: SoundType): string {
      switch (type) {
        case 'success':
          return 'pi pi-check';
        case 'warning':
          return 'pi pi-exclamation-triangle';
        case 'error':
          return 'pi pi-times';
      }
    }
  }
};
</script>
