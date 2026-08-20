<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- Single Icon Trigger Button -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      :class="triggerClass"
      :title="`Temă: ${currentLabel}`"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <!-- Sun Icon for Light Mode -->
      <i v-if="currentTheme === 'light'" class="pi pi-sun text-base text-amber-500 hover:rotate-45 transition-transform duration-300"></i>
      <!-- Moon Icon for Dark Mode -->
      <i v-else-if="currentTheme === 'dark'" class="pi pi-moon text-base text-indigo-400 hover:-rotate-12 transition-transform duration-300"></i>
      <!-- Desktop Icon for System Mode -->
      <i v-else class="pi pi-desktop text-base text-brand-500 dark:text-brand-400 hover:scale-110 transition-transform duration-300"></i>
    </button>

    <!-- Dropdown Menu -->
    <transition name="dropdown-fade">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border z-50 overflow-hidden backdrop-blur-xl p-1.5 space-y-1"
        :class="menuClass"
        role="menu"
      >
        <div class="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
          <span>Temă Interfață</span>
          <i class="pi pi-palette text-xs"></i>
        </div>

        <!-- Light Mode Option -->
        <button
          type="button"
          @click="selectTheme('light')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group"
          :class="currentTheme === 'light' ? activeItemClass : itemClass"
          role="menuitem"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="pi pi-sun text-xs"></i>
            </div>
            <span>Luminos (Light)</span>
          </div>
          <i v-if="currentTheme === 'light'" class="pi pi-check text-xs text-brand-600 dark:text-brand-400 font-bold"></i>
        </button>

        <!-- Dark Mode Option -->
        <button
          type="button"
          @click="selectTheme('dark')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group"
          :class="currentTheme === 'dark' ? activeItemClass : itemClass"
          role="menuitem"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="pi pi-moon text-xs"></i>
            </div>
            <span>Întunecat (Dark)</span>
          </div>
          <i v-if="currentTheme === 'dark'" class="pi pi-check text-xs text-brand-600 dark:text-brand-400 font-bold"></i>
        </button>

        <!-- System Mode Option -->
        <button
          type="button"
          @click="selectTheme('system')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group"
          :class="currentTheme === 'system' ? activeItemClass : itemClass"
          role="menuitem"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-6 h-6 rounded-lg bg-slate-500/10 text-slate-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="pi pi-desktop text-xs"></i>
            </div>
            <span>Sistem (Auto)</span>
          </div>
          <i v-if="currentTheme === 'system'" class="pi pi-check text-xs text-brand-600 dark:text-brand-400 font-bold"></i>
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import ThemeService, { type ThemeMode } from '@/services/theme.services';

export default {
  name: "ThemeSwitcher",
  data() {
    return {
      isOpen: false,
      currentTheme: 'system' as ThemeMode,
    };
  },
  computed: {
    currentLabel(): string {
      if (this.currentTheme === 'light') return 'Luminos (Light)';
      if (this.currentTheme === 'dark') return 'Întunecat (Dark)';
      return 'Sistem (Auto)';
    },
    triggerClass(): string {
      return this.isOpen
        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 shadow-md ring-2 ring-brand-500/20'
        : 'bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm';
    },
    menuClass(): string {
      return 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xl';
    },
    itemClass(): string {
      return 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white';
    },
    activeItemClass(): string {
      return 'bg-brand-50 dark:bg-slate-800/90 text-brand-700 dark:text-brand-300 font-bold border border-brand-100 dark:border-slate-700';
    }
  },
  created() {
    this.currentTheme = ThemeService.getTheme();
    ThemeService.onThemeChange((mode) => {
      this.currentTheme = mode;
    });
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    selectTheme(mode: ThemeMode) {
      this.currentTheme = mode;
      ThemeService.setTheme(mode);
      this.isOpen = false;
    },
    handleClickOutside(event: MouseEvent) {
      const dropdown = this.$refs.dropdownRef as HTMLElement | undefined;
      if (dropdown && !dropdown.contains(event.target as Node)) {
        this.isOpen = false;
      }
    }
  }
};
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
