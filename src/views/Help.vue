<template>
  <div class="h-[90.4vh] py-10">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-10">Ajutor și întrebări frecvente</h2>
      <div class="max-w-2xl mx-auto">
        <div v-for="(qa, index) in faqs" :key="index" class="mb-4">
          <div @click="toggle(index)"
            class="cursor-pointer bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg flex justify-between items-center">
            <h3 class="text-lg font-semibold">{{ qa.question }}</h3>
            <svg :class="{ 'transform rotate-180': activeIndex === index }" class="w-5 h-5 transition-transform"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          <div v-show="activeIndex === index" class="bg-white px-6 py-4 rounded-lg shadow-lg mt-2">
            <p>{{ qa.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      activeIndex: null,
      faqs: [
        { question: "Ce este Bar Reader Checker?", answer: "Bar Reader Checker este un instrument de scanare, importare și exportare eficientă a codurilor de bare." },
        { question: "Cum mă înscriu?", answer: "Faceți clic pe butonul Înregistrare din antet și completați datele dumneavoastră pentru a crea un cont." },
        { question: "Este disponibilă o perioadă de încercare gratuită?", answer: "Da, oferim o perioadă de încercare gratuită de 14 zile pentru utilizatorii noi." },
        { question: "Cum pot contacta asistența?", answer: "Puteți contacta echipa noastră de asistență prin intermediul formularului de contact de pe pagina Contactați-ne." },
        { question: "Ce metode de plată sunt acceptate?", answer: "Acceptăm toate cărțile de credit majore și PayPal." },
        { question: "Îmi pot actualiza planul mai târziu?", answer: "Da, puteți face oricând upgrade sau downgrade planul dvs. din setările contului." }
      ],
      router: useRouter(),
      authStore: useAuthStore(),
    }
  },
  methods: {
    toggle(index: any) {
      this.activeIndex = this.activeIndex === index ? null : index;
    }
  },
  async mounted() {

  }
}

</script>