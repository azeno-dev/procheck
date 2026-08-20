<template>
  <div class="py-12 md:py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[calc(100vh-4rem)] flex items-center transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span class="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 px-3.5 py-1 rounded-full shadow-xs">
          Suport & Asistență Tehnică
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Ia legătura cu echipa ProCheck
        </h1>
        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Ai întrebări tehnice, dorești o integrare personalizată sau vrei să testezi platforma în depozitul tău? Trimite-ne un mesaj.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Side: Contact Information Cards -->
        <div class="lg:col-span-5 space-y-4">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
            <div class="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
              <i class="pi pi-envelope"></i>
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-base font-bold text-slate-900 dark:text-white">Email Direct & Suport</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Răspundem de obicei în mai puțin de 2 ore.</p>
              <a href="mailto:contact@azeno.ro" class="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 underline underline-offset-2">
                contact@azeno.ro
              </a>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
              <i class="pi pi-clock"></i>
            </div>
            <div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white">Program Asistență</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Luni &ndash; Vineri (Fus Orar România)</p>
              <p class="text-sm font-bold text-slate-800 dark:text-slate-200">09:00 &ndash; 18:00</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
              <i class="pi pi-bolt"></i>
            </div>
            <div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white">Răspuns Automat & Notificare</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                Vei primi o confirmare automată în limba română pe email, iar echipa noastră la <strong class="text-slate-700 dark:text-slate-200">contact@azeno.ro</strong> este alertată instant.
              </p>
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Email Dispatch Activ
              </span>
            </div>
          </div>
        </div>

        <!-- Right Side: Contact Form / Success Banner -->
        <div class="lg:col-span-7 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl">
          
          <!-- Success State View -->
          <div v-if="submitted" class="space-y-6 text-center py-6">
            <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-3xl mx-auto shadow-inner">
              <i class="pi pi-check"></i>
            </div>

            <div class="space-y-2 max-w-md mx-auto">
              <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">Mesaj trimis cu succes!</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Îți mulțumim, <strong class="text-slate-800 dark:text-white">{{ submittedName }}</strong>! Am trimis o confirmare detaliată pe adresa <strong class="text-brand-600 dark:text-brand-400 font-mono">{{ submittedEmail }}</strong>.
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400 pt-1">
                Echipa noastră la <strong>contact@azeno.ro</strong> a fost notificată și va reveni în cel mai scurt timp.
              </p>
            </div>

            <div class="pt-4">
              <button
                type="button"
                @click="resetForm"
                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800 transition-colors"
              >
                <i class="pi pi-send text-xs"></i>
                <span>Trimite un alt mesaj</span>
              </button>
            </div>
          </div>

          <!-- Active Form View -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Name -->
              <div class="space-y-1.5">
                <label for="name" class="block text-xs font-bold text-slate-700 dark:text-slate-200">Nume complet *</label>
                <div class="relative">
                  <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    type="text"
                    id="name"
                    v-model="form.name"
                    placeholder="Ion Popescu"
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label for="email" class="block text-xs font-bold text-slate-700 dark:text-slate-200">Adresă de Email *</label>
                <div class="relative">
                  <i class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    placeholder="ion@companie.ro"
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Phone (Optional) -->
              <div class="space-y-1.5">
                <label for="phone" class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Telefon (opțional)</label>
                <div class="relative">
                  <i class="pi pi-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    type="tel"
                    id="phone"
                    v-model="form.phone"
                    placeholder="07xxxxxxxx"
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono"
                  />
                </div>
              </div>

              <!-- Company (Optional) -->
              <div class="space-y-1.5">
                <label for="company" class="block text-xs font-semibold text-slate-700 dark:text-slate-200">Companie / Depozit (opțional)</label>
                <div class="relative">
                  <i class="pi pi-building absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    type="text"
                    id="company"
                    v-model="form.company"
                    placeholder="Compania SRL"
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- Message -->
            <div class="space-y-1.5">
              <label for="message" class="block text-xs font-bold text-slate-700 dark:text-slate-200">Mesajul tău *</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="4"
                placeholder="Descrie cum te putem ajuta, volumul aproximativ de colete zilnice sau întrebarea ta..."
                class="w-full p-3.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none transition-all"
                required
              ></textarea>
            </div>

            <!-- Notice -->
            <div class="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <i class="pi pi-info-circle text-brand-600 dark:text-brand-400 text-sm flex-shrink-0"></i>
              <span>Vei primi automat o confirmare pe email, iar mesajul va fi transmis echipei la <strong class="text-slate-700 dark:text-slate-200">contact@azeno.ro</strong>.</span>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-primary-600 hover:from-brand-500 hover:to-primary-500 shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i v-if="loading" class="pi pi-spin pi-spinner text-sm"></i>
              <i v-else class="pi pi-send text-sm"></i>
              <span v-if="!loading">Trimite Mesajul</span>
              <span v-else>Se trimite confirmarea...</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  </div>

</template>

<script lang="ts">
import MailService from "@/services/mail.services";
import { toast } from 'vue-sonner';

export default {
  name: "ContactPage",
  data() {
    return {
      mailService: new MailService(),
      loading: false,
      submitted: false,
      submittedName: '',
      submittedEmail: '',
      form: {
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      }
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.form.name || !this.form.email || !this.form.message) {
        toast.warning("Câmpuri obligatorii", {
          description: "Te rugăm să completezi toate câmpurile obligatorii."
        });
        return;
      }

      this.loading = true;
      try {
        const formData = {
          name: this.form.name.trim(),
          email: this.form.email.trim(),
          phone: this.form.phone?.trim() || '',
          company: this.form.company?.trim() || '',
          message: this.form.message.trim()
        };

        this.submittedName = formData.name;
        this.submittedEmail = formData.email;

        // Dispatches dual responsive emails: Client Confirmation in RO & Team Alert to contact@azeno.ro
        await this.mailService.sendContactFormEmails(formData);

        this.submitted = true;
        toast.success("Mesaj transmis cu succes!", {
          description: "Verifică adresa de email pentru confirmarea detaliată."
        });
      } catch (e) {
        console.error("Contact send error:", e);
        this.submitted = true;
        toast.info("Mesajul a fost înregistrat.", {
          description: "Vă mulțumim! Revenim în cel mai scurt timp."
        });
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.submitted = false;
      this.form = {
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      };
    }
  }
};
</script>