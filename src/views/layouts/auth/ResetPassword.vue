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

    <!-- Main Container: Full Screen Split -->
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
            <i class="pi pi-shield"></i>
            <span>Recuperare Securizată Cont</span>
          </div>

          <h1 class="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
            Recuperează accesul la platforma ta de scanare.
          </h1>

          <p class="text-slate-300 text-sm xl:text-base leading-relaxed">
            Sistemul de securitate ProCheck îți permite resetarea rapidă a parolei prin link securizat transmis pe adresa ta de email.
          </p>

          <div class="grid grid-cols-2 gap-4 pt-4">
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <i class="pi pi-lock text-brand-400 text-lg"></i>
              <h4 class="text-xs font-bold text-slate-200">Criptare End-to-End</h4>
              <p class="text-[11px] text-slate-400">Token-uri temporare generate de PocketBase</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <i class="pi pi-check-circle text-emerald-400 text-lg"></i>
              <h4 class="text-xs font-bold text-slate-200">Activare Imediată</h4>
              <p class="text-[11px] text-slate-400">Reautentificare instantanee după setare</p>
            </div>
          </div>
        </div>

        <div class="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-6">
          <span>&copy; {{ new Date().getFullYear() }} ProCheck Logistics Hub</span>
          <router-link to="/help" class="hover:text-white transition-colors">Centru Suport</router-link>
        </div>
      </div>

      <!-- Right Form Column: Full Height Center -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-16 min-h-screen">
        <div class="w-full max-w-md space-y-8 bg-white dark:bg-slate-900/80 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl transition-colors duration-200">
          
          <!-- Mobile Brand Header -->
          <div class="lg:hidden flex items-center gap-2.5 pb-2">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-primary-400 flex items-center justify-center text-white shadow-glow-primary">
              <i class="pi pi-barcode text-lg"></i>
            </div>
            <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Pro<span class="text-brand-600 dark:text-brand-400">Check</span></span>
          </div>

          <!-- Step 1: Request Reset Link Form -->
          <div v-if="!tokenMode && !emailSent" class="space-y-6">
            <div class="space-y-2">
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Ai uitat parola?</h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Introdu adresa de email înregistrată și îți vom trimite instrucțiunile de resetare.
              </p>
            </div>

            <form @submit.prevent="handleRequestReset" class="space-y-5">
              <div class="space-y-1.5">
                <label for="reset-email" class="block text-xs font-bold text-slate-700 dark:text-slate-300">Adresă Email</label>
                <div class="relative">
                  <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    v-model="email"
                    type="email"
                    id="reset-email"
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

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-primary-600 hover:from-brand-500 hover:to-primary-500 shadow-lg shadow-brand-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <i v-if="loading" class="pi pi-spin pi-spinner text-sm"></i>
                <span>{{ loading ? 'Se trimite cererea...' : 'Trimite Link Resetare' }}</span>
              </button>
            </form>
          </div>

          <!-- Step 2: Email Sent Success Banner -->
          <div v-else-if="!tokenMode && emailSent" class="space-y-6 text-center py-4">
            <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-3xl mx-auto shadow-inner">
              <i class="pi pi-check"></i>
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Verifică email-ul!</h2>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Am trimis linkul de resetare a parolei la adresa <strong class="text-slate-900 dark:text-white font-mono">{{ email }}</strong>.
              </p>
              <p class="text-[11px] text-slate-400 pt-2">
                Dacă nu îl găsești în Inbox, te rugăm să verifici și folderul Spam.
              </p>
            </div>

            <button
              type="button"
              @click="emailSent = false"
              class="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Încearcă cu o altă adresă de email
            </button>
          </div>

          <!-- Step 3: Confirm New Password (when token is in URL) -->
          <div v-else class="space-y-6">
            <div class="space-y-2">
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Setează o parolă nouă</h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Alege o parolă sigură de cel puțin 8 caractere pentru contul tău.
              </p>
            </div>

            <form @submit.prevent="handleConfirmReset" class="space-y-4">
              <!-- New Password -->
              <div class="space-y-1.5">
                <label for="new-pass" class="block text-xs font-bold text-slate-700 dark:text-slate-300">Noua Parolă</label>
                <div class="relative">
                  <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    v-model="newPassword"
                    :type="showNewPass ? 'text' : 'password'"
                    id="new-pass"
                    placeholder="Minim 8 caractere"
                    class="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    @click="showNewPass = !showNewPass"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                  >
                    <i :class="showNewPass ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-1.5">
                <label for="confirm-pass" class="block text-xs font-bold text-slate-700 dark:text-slate-300">Confirmă Parola</label>
                <div class="relative">
                  <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    v-model="confirmPassword"
                    :type="showNewPass ? 'text' : 'password'"
                    id="confirm-pass"
                    placeholder="Reintrodu parola"
                    class="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono"
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
                <span>{{ loading ? 'Se salvează noua parolă...' : 'Salvează și Conectează-te' }}</span>
              </button>
            </form>
          </div>

          <!-- Back to Login Navigation -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <router-link
              to="/auth/login"
              class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <i class="pi pi-arrow-left text-xs"></i>
              <span>Înapoi la Autentificare</span>
            </router-link>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue3-toastify';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';

export default {
  name: "ResetPassword",
  components: {
    ThemeSwitcher,
  },
  data() {
    return {
      email: '',
      newPassword: '',
      confirmPassword: '',
      showNewPass: false,
      loading: false,
      emailSent: false,
      errorMessage: '',
      token: '',
      tokenMode: false,
      authStore: useAuthStore(),
    };
  },
  created() {
    const token = this.$route.query.token as string;
    if (token) {
      this.token = token;
      this.tokenMode = true;
    }
  },
  methods: {
    async handleRequestReset() {
      this.errorMessage = '';
      if (!this.email) {
        this.errorMessage = 'Te rugăm să introduci adresa de email.';
        return;
      }

      this.loading = true;
      try {
        await this.authStore.requestPasswordReset(this.email.trim());
        this.emailSent = true;
        toast.success("Linkul de resetare a fost trimis cu succes!");
      } catch (err: any) {
        console.error("Password reset error:", err);
        this.emailSent = true;
        toast.info("Dacă adresa există în sistem, instrucțiunile au fost trimise.");
      } finally {
        this.loading = false;
      }
    },
    async handleConfirmReset() {
      this.errorMessage = '';
      if (!this.newPassword || !this.confirmPassword) {
        this.errorMessage = 'Completează ambele câmpuri de parolă.';
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Parolele introduse nu coincid!';
        return;
      }
      if (this.newPassword.length < 8) {
        this.errorMessage = 'Parola trebuie să aibă minim 8 caractere.';
        return;
      }

      this.loading = true;
      try {
        await this.authStore.confirmPasswordReset(this.token, this.newPassword, this.confirmPassword);
        toast.success("Parola a fost actualizată cu succes!");
        this.$router.push('/auth/login');
      } catch (err: any) {
        console.error("Confirm reset error:", err);
        this.errorMessage = 'Linkul de resetare a expirat sau este invalid. Te rugăm să soliciți un nou link.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
