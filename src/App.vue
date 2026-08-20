<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
    <!-- Public Header (when not inside app workspace and not on auth pages) -->
    <header v-if="!$route.path.startsWith(pageStart) && !$route.path.startsWith('/auth')" class="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-all w-full">
      <nav class="w-full px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-primary-500 to-indigo-400 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform duration-200">
            <i class="pi pi-barcode text-xl"></i>
          </div>
          <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pro<span class="text-brand-600 dark:text-brand-400">Check</span>
          </span>
        </router-link>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
          <router-link
            to="/"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
            :class="$route.path === '/' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
          >
            Acasă
          </router-link>
          <a
            href="/#features"
            class="px-4 py-1.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Funcționalități
          </a>
          <a
            href="/#how"
            class="px-4 py-1.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cum funcționează
          </a>
          <a
            href="/#pricing"
            class="px-4 py-1.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Prețuri
          </a>
          <router-link
            to="/help"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
            :class="$route.path === '/help' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
          >
            Ajutor
          </router-link>
          <router-link
            to="/contact"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
            :class="$route.path === '/contact' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
          >
            Contact
          </router-link>
        </div>

        <!-- Desktop CTA Actions -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Theme Switcher -->
          <ThemeSwitcher />

          <template v-if="!user || !user.id">
            <router-link to="/auth/login" class="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Autentificare
            </router-link>
            <router-link to="/contact" class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-primary-600 hover:from-brand-500 hover:to-primary-500 rounded-xl shadow-sm hover:shadow transition-all duration-200">
              Cere Acces Demo
            </router-link>
          </template>

          <template v-else>
            <router-link :to="primaryPage" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-sm transition-all">
              <i class="pi pi-th-large text-xs"></i>
              Deschide Aplicația
            </router-link>
            <button @click="logout" class="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors" title="Deconectare">
              <i class="pi pi-sign-out text-lg"></i>
            </button>
          </template>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Deschide meniu">
          <i :class="mobileMenuOpen ? 'pi pi-times text-xl' : 'pi pi-bars text-xl'"></i>
        </button>
      </nav>

      <!-- Mobile Dropdown / Drawer Menu -->
      <transition name="slide-up">
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <router-link @click="mobileMenuOpen = false" to="/" class="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400">
            Acasă
          </router-link>
          <a @click="mobileMenuOpen = false" href="/#features" class="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400">
            Funcționalități
          </a>
          <a @click="mobileMenuOpen = false" href="/#how" class="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400">
            Cum funcționează
          </a>
          <a @click="mobileMenuOpen = false" href="/#pricing" class="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400">
            Prețuri
          </a>
          <router-link @click="mobileMenuOpen = false" to="/help" class="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400">
            Ajutor
          </router-link>
          <router-link @click="mobileMenuOpen = false" to="/contact" class="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400">
            Contact
          </router-link>

          <!-- Theme Switcher Row -->
          <div class="pt-2 pb-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <span class="text-xs font-bold text-slate-600 dark:text-slate-400">Temă:</span>
            <ThemeSwitcher />
          </div>

          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <template v-if="!user || !user.id">
              <router-link @click="mobileMenuOpen = false" to="/auth/login" class="w-full text-center px-4 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
                Autentificare
              </router-link>
              <router-link @click="mobileMenuOpen = false" to="/contact" class="w-full text-center px-4 py-2.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-500">
                Cere Acces Demo
              </router-link>
            </template>
            <template v-else>
              <router-link @click="mobileMenuOpen = false" :to="primaryPage" class="w-full text-center px-4 py-2.5 rounded-xl font-semibold text-white bg-brand-600">
                Deschide Aplicația
              </router-link>
              <button @click="logout(); mobileMenuOpen = false" class="w-full text-center px-4 py-2 rounded-xl font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40">
                Deconectare
              </button>
            </template>
          </div>
        </div>
      </transition>
    </header>

    <!-- App Header (Workspace Mode: /integrations, /integrations/import, /integrations/sameday, /integrations/dashboard) -->
    <header v-else-if="$route.path.startsWith(pageStart)" class="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-all w-full">
      <div class="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <!-- Left: Logo & Workspace Tabs -->
        <div class="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
          <router-link to="/" class="flex items-center gap-2.5 group shrink-0">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-primary-400 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
              <i class="pi pi-barcode text-lg"></i>
            </div>
            <span class="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight hidden sm:inline">
              Pro<span class="text-brand-600 dark:text-brand-400">Check</span>
            </span>
          </router-link>

          <!-- Desktop App Nav Tabs (Segmented control) -->
          <nav class="hidden md:flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
            <router-link
              to="/integrations/dashboard"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
              :class="$route.path.includes('/dashboard') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'"
            >
              <i class="pi pi-chart-bar text-xs"></i>
              <span>Statistici</span>
            </router-link>

            <router-link
              to="/integrations/import"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
              :class="$route.path === '/integrations/import' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'"
            >
              <i class="pi pi-file-import text-xs"></i>
              <span>Verificare Import</span>
            </router-link>

            <router-link
              to="/integrations/sameday"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
              :class="$route.path === '/integrations/sameday' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'"
            >
              <i class="pi pi-truck text-xs"></i>
              <span>Sameday Live</span>
            </router-link>

            <router-link
              to="/integrations"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
              :class="$route.path === '/integrations' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/40'"
            >
              <i class="pi pi-th-large text-xs"></i>
              <span>Integrări</span>
            </router-link>
          </nav>
        </div>

        <!-- Right: User Controls & Quick actions -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <router-link
            to="/help"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
          >
            <i class="pi pi-question-circle text-xs"></i>
            <span>Ghid Utilizare</span>
          </router-link>

          <div class="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <!-- Theme Option: Light, Dark, System next to User -->
          <ThemeSwitcher />

          <div class="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          <!-- User Profile Pill & Dropdown -->
          <div class="flex items-center gap-2">
            <div class="text-right hidden sm:block">
              <p class="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[140px]">{{ (user && user.name) || (user && user.email) || 'Utilizator' }}</p>
              <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Autentificat
              </p>
            </div>

            <button
              type="button"
              @click="toggleUserMenu"
              class="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-haspopup="true"
              title="Meniu Utilizator"
            >
              <Avatar
                :image="user && user.avatar ? getLinkForImage(user.collectionId, user.id, user.avatar) : ''"
                :icon="!(user && user.avatar) ? 'pi pi-user' : undefined"
                shape="circle"
                class="bg-brand-600 text-white"
              />
              <i class="pi pi-angle-down text-xs text-slate-400 pr-1"></i>
            </button>
            <Menu ref="menuUser" id="overlay_menu" :model="userItems" :popup="true" />
          </div>

          <!-- Mobile App Menu Toggle -->
          <button
            @click="mobileAppMenuOpen = !mobileAppMenuOpen"
            class="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Meniu Navigare"
          >
            <i :class="mobileAppMenuOpen ? 'pi pi-times text-lg' : 'pi pi-bars text-lg'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile App Drawer with Large Buttons -->
      <transition name="slide-up">
        <div v-if="mobileAppMenuOpen" class="md:hidden bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 shadow-xl">
          <!-- Theme Switcher Row -->
          <div class="pt-1 pb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-bold text-slate-600 dark:text-slate-400">Temă:</span>
            <ThemeSwitcher />
          </div>

          <router-link
            @click="mobileAppMenuOpen = false"
            to="/integrations/dashboard"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            :class="$route.path.includes('/dashboard') ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            <i class="pi pi-chart-bar"></i>
            <span>Statistici & Rapoarte</span>
          </router-link>
          <router-link
            @click="mobileAppMenuOpen = false"
            to="/integrations/import"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            :class="$route.path === '/integrations/import' ? 'bg-brand-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            <i class="pi pi-file-import"></i>
            <span>Verificare Import (Excel)</span>
          </router-link>
          <router-link
            @click="mobileAppMenuOpen = false"
            to="/integrations/sameday"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            :class="$route.path === '/integrations/sameday' ? 'bg-red-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            <i class="pi pi-truck"></i>
            <span>Sameday Live</span>
          </router-link>
          <router-link
            @click="mobileAppMenuOpen = false"
            to="/integrations"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            :class="$route.path === '/integrations' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            <i class="pi pi-th-large"></i>
            <span>Toate Integrările</span>
          </router-link>
          <router-link
            @click="mobileAppMenuOpen = false"
            to="/help"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <i class="pi pi-question-circle"></i>
            <span>Centru de Ajutor & Ghid</span>
          </router-link>
        </div>
      </transition>
    </header>

    <!-- Main Content Area with Smooth Page Transition -->
    <main class="flex-1 flex flex-col">
      <router-view v-slot="{ Component, route }" :key="$route.path">
        <transition name="slide-up" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Footer (hidden on full-screen auth pages) -->
    <Footer v-if="!$route.path.startsWith('/auth')" />

    <!-- Global Modern Sonner Toaster (Stacked physics, rich colors, dark mode sync) -->
    <Toaster richColors position="bottom-right" closeButton :expand="true" :visibleToasts="4" />
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { Toaster } from "vue-sonner";
import Footer from "@/components/Footer.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import ThemeService from "@/services/theme.services";
import { useAuthStore, type Integration } from '@/stores/auth';
import { Constants } from '@/Constants';

export default {
  name: "AppShell",
  components: {
    Footer,
    ThemeSwitcher,
    Toaster,
  },
  data() {
    return {
      mobileMenuOpen: false,
      mobileAppMenuOpen: false,
      primaryPage: Constants.primaryPage,
      pageStart: Constants.pageStart,
      user: {
        id: "",
        name: "",
        email: "",
        collectionId: "",
        avatar: "",
      } as any,
      integrations: [] as Integration[],
      authStore: useAuthStore(),
      userItems: [
        {
          label: "Cont & Profil",
          items: [
            {
              label: "Panou Statistici",
              icon: "pi pi-chart-bar",
              command: () => this.$router.push("/integrations/dashboard"),
            },
            {
              label: "Integrări Curieri",
              icon: "pi pi-microchip",
              command: () => this.$router.push("/integrations"),
            },
            {
              label: "Verificare Import",
              icon: "pi pi-file-import",
              command: () => this.$router.push("/integrations/import"),
            },
            {
              label: "Ajutor & FAQ",
              icon: "pi pi-info-circle",
              command: () => this.$router.push("/help"),
            },
            {
              separator: true
            },
            {
              label: "Temă Luminoasă (Light)",
              icon: "pi pi-sun text-amber-500",
              command: () => ThemeService.setTheme("light"),
            },
            {
              label: "Temă Întunecată (Dark)",
              icon: "pi pi-moon text-indigo-400",
              command: () => ThemeService.setTheme("dark"),
            },
            {
              label: "Temă Sistem (Auto)",
              icon: "pi pi-desktop text-slate-400",
              command: () => ThemeService.setTheme("system"),
            },
            {
              separator: true
            },
            {
              label: "Deconectare",
              icon: "pi pi-sign-out",
              command: async () => await this.logout(),
            },
          ],
        },
      ],
    };
  },
  setup() {
    const menuUser = ref();
    return {
      menuUser,
    };
  },
  methods: {
    toggleUserMenu(event: any) {
      if (this.menuUser) {
        this.menuUser.toggle(event);
      }
    },
    getLinkForImage(collection: string, id: string, image: string) {
      if (!image) return '';
      return `${Constants.database.url}/api/files/${collection}/${id}/${image}?download`;
    },
    async logout() {
      this.authStore.logout();
      this.user = null;
      await this.$router.push({
        path: "/",
        force: true,
      });
    },
    syncUserData() {
      this.user = this.authStore.getUser();
      this.integrations = this.authStore.getIntegrations();
    }
  },
  async mounted() {
    this.syncUserData();
    if (this.$route.path.startsWith(Constants.pageStart)) {
      if (!this.authStore.user && !this.user) {
        await this.$router.push({
          path: "/auth/login",
          force: true,
        });
      }
    }
  },
  watch: {
    '$route'() {
      this.syncUserData();
      this.mobileMenuOpen = false;
      this.mobileAppMenuOpen = false;
    }
  }
};
</script>

