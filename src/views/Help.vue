<template>
  <div class="py-12 md:py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[calc(100vh-4rem)] transition-colors duration-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <span class="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
          Suport & Documentație
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Centrul de Ajutor & Întrebări Frecvente
        </h1>
        <p class="text-base text-slate-600">
          Găsește rapid răspunsuri despre configurarea cititorului de coduri de bare, importul fișierelor Excel și sincronizarea cu curierii.
        </p>

        <!-- Search box -->
        <div class="relative max-w-xl mx-auto pt-4">
          <i class="pi pi-search absolute left-4 top-1/2 translate-y-0.5 text-slate-400 text-base"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Caută o întrebare sau problemă..."
            class="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      <!-- Quick Guides Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-lg">
            <i class="pi pi-barcode"></i>
          </div>
          <h3 class="font-bold text-slate-900">Configurare Scanner</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Majoritatea cititoarelor USB/Bluetooth funcționează automat în mod emulare tastatură (HID) trimițând Enter după scanare.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <i class="pi pi-file-excel"></i>
          </div>
          <h3 class="font-bold text-slate-900">Format Fișier Excel</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Fișierele exportate din aplicația Sameday / Curierat pot fi încărcate direct fără modificarea numelui coloanelor.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
            <i class="pi pi-shield"></i>
          </div>
          <h3 class="font-bold text-slate-900">Confidențialitate Date</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            Datele scanate sunt procesate în siguranță, iar sesiunile temporare expiră automat conform setărilor alese.
          </p>
        </div>
      </div>

      <!-- FAQs Accordion -->
      <div class="space-y-4 max-w-3xl mx-auto">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Întrebări Frecvente</h2>

        <div
          v-for="(qa, index) in filteredFaqs"
          :key="index"
          class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200"
        >
          <button
            @click="toggle(index)"
            class="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
          >
            <span class="font-semibold text-slate-900 text-sm sm:text-base">{{ qa.question }}</span>
            <div
              class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-transform duration-200 flex-shrink-0"
              :class="{ 'rotate-180 bg-brand-50 text-brand-600': activeIndex === index }"
            >
              <i class="pi pi-chevron-down text-xs"></i>
            </div>
          </button>

          <transition name="slide-up">
            <div v-show="activeIndex === index" class="px-6 pb-5 pt-1 text-slate-600 text-sm border-t border-slate-100 bg-slate-50/40 leading-relaxed">
              {{ qa.answer }}
            </div>
          </transition>
        </div>

        <div v-if="filteredFaqs.length === 0" class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
          Nu am găsit nicio întrebare potrivită căutării tale.
        </div>
      </div>

      <!-- Contact Banner -->
      <div class="bg-gradient-to-r from-slate-900 to-slate-950 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl max-w-4xl mx-auto border border-slate-800">
        <div class="space-y-1 text-center sm:text-left">
          <h3 class="text-xl font-bold">Ai nevoie de asistență suplimentară?</h3>
          <p class="text-xs sm:text-sm text-slate-400">Echipa noastră de suport tehnic îți stă la dispoziție.</p>
        </div>
        <router-link to="/contact" class="px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 transition-all flex-shrink-0">
          Trimite un Mesaj
        </router-link>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "HelpPage",
  data() {
    return {
      searchQuery: "",
      activeIndex: null as number | null,
      faqs: [
        {
          question: "Ce este ProCheck și cum mă ajută în depozit?",
          answer: "ProCheck este o platformă dedicată verificării expedierilor. Ea compară în timp real lista de AWB-uri emise cu etichetele fizice scanate pe cutiile de expediere, confirmând acustic și vizual că fiecare pachet este corect pregătit și nu este duplicat."
        },
        {
          question: "Cum conectez cititorul de coduri de bare la aplicație?",
          answer: "Nu este necesară nicio instalare de drivere. Orice scanner standard USB sau Bluetooth funcționează ca tastatură. Asigură-te că cursorul este poziționat în câmpul de scanare AWB, iar scannerul va trimite automat numărul AWB urmat de tasta Enter."
        },
        {
          question: "Ce formate de fișiere pot importa?",
          answer: "ProCheck suportă fișiere Microsoft Excel (.xlsx, .xls) exportate direct din platformele Sameday, Fan Courier, DPD, Cargus sau din sistemul dvs. intern ERP/WMS."
        },
        {
          question: "Cum funcționează semnalele sonore de avertizare?",
          answer: "Aplicația emite sunete distincte: un ton plăcut pentru colet validat cu succes ('Pregătit'), un sunet de avertizare la scanarea unui colet deja pregătit (evitând dublurile) și un sunet de eroare dacă AWB-ul scanat nu se regăsește în lista zilei."
        },
        {
          question: "Ce se întâmplă dacă reîmprospătez pagina sau se întrerupe conexiunea?",
          answer: "Toate datele importate și starea verificărilor sunt salvate în siguranță în memoria locală (localStorage) a browserului pe durata de valabilitate configurată (implicit 12 ore)."
        },
        {
          question: "Pot folosi ProCheck pe o tabletă sau telefon mobil?",
          answer: "Da, interfața este 100% responsivă și optimizată pentru dispozitive mobile, tablete industriale de depozit și monitoare tactile."
        }
      ],
    };
  },
  computed: {
    filteredFaqs(): Array<{ question: string; answer: string }> {
      if (!this.searchQuery.trim()) {
        return this.faqs;
      }
      const q = this.searchQuery.toLowerCase();
      return this.faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    }
  },
  methods: {
    toggle(index: number) {
      this.activeIndex = this.activeIndex === index ? null : index;
    }
  }
};
</script>