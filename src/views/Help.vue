<template>
  <div class="h-[90.4vh] py-10">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-10">Help & FAQs</h2>
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
        { question: "What is Bar Reader Checker?", answer: "Bar Reader Checker is a tool to scan, import, and export barcodes efficiently." },
        { question: "How do I sign up?", answer: "Click on the Signup button in the header and fill in your details to create an account." },
        { question: "Is there a free trial available?", answer: "Yes, we offer a 14-day free trial for new users." },
        { question: "How do I contact support?", answer: "You can contact our support team via the contact form on our Contact Us page." },
        { question: "What payment methods are accepted?", answer: "We accept all major credit cards and PayPal." },
        { question: "Can I upgrade my plan later?", answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings." }
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