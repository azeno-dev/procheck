<template>
  <div class="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white relative overflow-hidden transition-colors duration-200">
    
    <!-- Top Right Actions: Theme Switcher & Home Link -->
    <div class="absolute top-5 right-5 sm:top-6 sm:right-6 z-50 flex items-center gap-2.5">
      <ThemeSwitcher />
      <router-link
        to="/"
        class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md transition-all"
        title="Pagina Principală"
      >
        <i class="pi pi-home text-xs"></i>
        <span>Acasă</span>
      </router-link>
    </div>

    <!-- Background Ambient Glow & Grid -->
    <div class="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Main Container: Full Screen Split Layout -->
    <div class="w-full flex flex-col lg:flex-row items-stretch z-10">
      
      <!-- Left Visual Hero Column (Desktop & Tablet) -->
      <div class="hidden lg:flex lg:w-1/2 p-12 xl:p-16 flex-col justify-between border-r border-slate-200 dark:border-slate-800/80 bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white backdrop-blur-xl relative">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-primary-400 flex items-center justify-center text-white shadow-glow-primary">
            <i class="pi pi-barcode text-xl"></i>
          </div>
          <span class="text-2xl font-black tracking-tight text-white">Pro<span class="text-brand-400">Check</span></span>
        </div>

        <div class="space-y-6 max-w-lg">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Platformă Verificare Logistică v2.0</span>
          </div>

          <h1 class="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
            Validare AWB și gestiune depozit în timp real.
          </h1>

          <p class="text-slate-300 text-sm xl:text-base leading-relaxed">
            Conectează scanerul mobil, importă fișierele de curierat și sincronizează coletele Sameday direct pe desktop.
          </p>

          <div class="grid grid-cols-2 gap-4 pt-4">
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <i class="pi pi-sync text-brand-400 text-lg"></i>
              <h4 class="text-xs font-bold text-slate-200">Sincronizare Live</h4>
              <p class="text-[11px] text-slate-400">Scanare mobilă reflectată instant pe desktop</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <i class="pi pi-database text-emerald-400 text-lg"></i>
              <h4 class="text-xs font-bold text-slate-200">PocketBase Cloud</h4>
              <p class="text-[11px] text-slate-400">Arhivare și rapoarte statistice securizate</p>
            </div>
          </div>
        </div>

        <div class="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-6">
          <span>&copy; {{ new Date().getFullYear() }} ProCheck Solutions</span>
          <div class="flex items-center gap-4">
            <router-link to="/help" class="hover:text-white transition-colors">Ghid Utilizare</router-link>
            <router-link to="/contact" class="hover:text-white transition-colors">Contact</router-link>
          </div>
        </div>
      </div>

      <!-- Right Column: Authentication & Reset Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-16 min-h-screen">
        <div class="w-full max-w-md space-y-7 bg-white dark:bg-slate-900/80 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl transition-colors duration-200">
          
          <!-- Mobile Brand Logo -->
          <div class="lg:hidden flex items-center gap-2.5 pb-2">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-primary-400 flex items-center justify-center text-white shadow-glow-primary">
              <i class="pi pi-barcode text-lg"></i>
            </div>
            <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Pro<span class="text-brand-600 dark:text-brand-400">Check</span></span>
          </div>

          <!-- MODE 1: LOGIN FORM -->
          <div v-if="authMode === 'login'" class="space-y-6">
            <div class="space-y-1">
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Autentificare</h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Introdu datele de conectare pentru a accesa contul</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="submitLogin" class="space-y-4">
              <!-- Email -->
              <div class="space-y-1.5">
                <label for="login-email" class="block text-xs font-bold text-slate-700 dark:text-slate-300">Email</label>
                <div class="relative">
                  <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    v-model="email"
                    type="email"
                    id="login-email"
                    placeholder="nume@companie.ro"
                    class="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label for="login-password" class="block text-xs font-bold text-slate-700 dark:text-slate-300">Parolă</label>
                  <button
                    type="button"
                    @click="authMode = 'forgot'; errorMessage = ''"
                    class="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline transition-colors"
                  >
                    Ai uitat parola?
                  </button>
                </div>
                <div class="relative">
                  <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    id="login-password"
                    placeholder="••••••••"
                    class="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                  >
                    <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                  </button>
                </div>
              </div>

              <!-- Error Alert -->
              <div v-if="errorMessage" class="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <i class="pi pi-exclamation-circle text-rose-500 dark:text-rose-400 text-sm shrink-0"></i>
                <span>{{ errorMessage }}</span>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-primary-600 hover:from-brand-500 hover:to-primary-500 shadow-lg shadow-brand-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <i v-if="loading" class="pi pi-spin pi-spinner text-sm"></i>
                <span>{{ loading ? 'Se verifică contul...' : 'Conectare' }}</span>
              </button>
            </form>

            <div class="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Nu ai un cont activ?
                <router-link to="/contact" class="font-bold text-brand-600 dark:text-brand-400 hover:underline ml-1">
                  Solicită acces cont
                </router-link>
              </p>
            </div>
          </div>

          <!-- MODE 2: FORGOT PASSWORD FORM -->
          <div v-else-if="authMode === 'forgot' && !emailSent" class="space-y-6">
            <div class="space-y-1">
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Resetare Parolă</h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Introdu adresa de email pentru a primi instrucțiunile de resetare a parolei.
              </p>
            </div>

            <!-- Forgot Form -->
            <form @submit.prevent="submitForgotPassword" class="space-y-4">
              <div class="space-y-1.5">
                <label for="forgot-email" class="block text-xs font-bold text-slate-700 dark:text-slate-300">Email Înregistrat</label>
                <div class="relative">
                  <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    v-model="email"
                    type="email"
                    id="forgot-email"
                    placeholder="nume@companie.ro"
                    class="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <!-- Error Alert -->
              <div v-if="errorMessage" class="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <i class="pi pi-exclamation-circle text-rose-500 dark:text-rose-400 text-sm shrink-0"></i>
                <span>{{ errorMessage }}</span>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-primary-600 hover:from-brand-500 hover:to-primary-500 shadow-lg shadow-brand-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <i v-if="loading" class="pi pi-spin pi-spinner text-sm"></i>
                <span>{{ loading ? 'Se trimite cererea...' : 'Trimite Link Resetare' }}</span>
              </button>
            </form>

            <div class="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                type="button"
                @click="authMode = 'login'; errorMessage = ''"
                class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <i class="pi pi-arrow-left text-xs"></i>
                <span>Înapoi la Autentificare</span>
              </button>
            </div>
          </div>

          <!-- MODE 3: RESET EMAIL SENT BANNER -->
          <div v-else class="space-y-6 text-center py-2">
            <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-3xl mx-auto shadow-inner">
              <i class="pi pi-check"></i>
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Email Trimis!</h2>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Am trimis linkul de resetare a parolei la adresa <strong class="text-slate-900 dark:text-white font-mono">{{ email }}</strong>.
              </p>
              <p class="text-[11px] text-slate-400 pt-2">
                Te rugăm să verifici Inbox-ul sau folderul Spam.
              </p>
            </div>

            <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              <button
                type="button"
                @click="emailSent = false; authMode = 'login'"
                class="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                Conectează-te cu noua parolă
              </button>

              <button
                type="button"
                @click="emailSent = false"
                class="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Retrimite sau schimbă adresa de email
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from "@/stores/auth";
import { Constants } from "@/Constants";
import { toast } from 'vue3-toastify';
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

export default {
  name: 'LoginPage',
  components: {
    ThemeSwitcher,
  },
  data() {
    return {
      authMode: 'login' as 'login' | 'forgot',
      email: '',
      password: '',
      showPassword: false,
      loading: false,
      emailSent: false,
      errorMessage: '',
      authStore: useAuthStore()
    };
  },
  methods: {
    async submitLogin() {
      this.errorMessage = "";
      if (!this.email || !this.password) {
        this.errorMessage = 'Vă rugăm să introduceți atât e-mailul, cât și parola.';
        return;
      }

      this.loading = true;
      try {
        await this.authStore.login(this.email.trim(), this.password);

        if (this.authStore && this.authStore.user) {
          toast.success("Autentificare reușită!");
          this.$router.push({ path: Constants.primaryPage, force: true });
        } else {
          this.errorMessage = "Email sau parolă incorectă!";
        }
      } catch (err: any) {
        console.error("Login error:", err);
        this.errorMessage = "Email sau parolă incorectă sau serverul nu răspunde.";
      } finally {
        this.loading = false;
      }
    },
    async submitForgotPassword() {
      this.errorMessage = "";
      if (!this.email) {
        this.errorMessage = 'Te rugăm să introduci adresa de email.';
        return;
      }

      this.loading = true;
      try {
        await this.authStore.requestPasswordReset(this.email.trim());
        this.emailSent = true;
        toast.success("Cererea de resetare a fost expediată!");
      } catch (err: any) {
        console.error("Forgot password error:", err);
        this.emailSent = true;
      } finally {
        this.loading = false;
      }
    }
  },
  async mounted() {
    if (localStorage.getItem('pocketbase_auth')) {
      localStorage.removeItem('pocketbase_auth');
    }
  },
};
</script>