<template>
  <div class="h-[90.4vh] py-10">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-10">Contactați-ne</h2>
      <p class="text-center">Înscrieți-vă acum. Este gratuit și durează mai puțin de 3 minute</p>
      <div class="max-w-xl mx-auto bg-white p-8 rounded shadow-lg">
        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label for="name" class="block text-gray-700 font-semibold mb-2">Nume</label>
            <input type="text" id="name" v-model="form.name"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div class="mb-6">
            <label for="email" class="block text-gray-700 font-semibold mb-2">Email</label>
            <input type="email" id="email" v-model="form.email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div class="mb-6">
            <label for="message" class="block text-gray-700 font-semibold mb-2">Mesaj</label>
            <textarea id="message" v-model="form.message"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4"
              required></textarea>
          </div>
          <div class="text-center">
            <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-400">Trimite</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <Toast />

</template>


<script lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from "primevue/usetoast";
import MailService from "@/services/mail.services";
import { Constants } from "@/Constants";

export default {
  data() {
    return {
      toast: useToast(),
      mailService: new MailService(),
      form: {
        name: '',
        email: '',
        message: ''
      },
      router: useRouter(),
      authStore: useAuthStore(),
    }
  },
  methods: {
    async handleSubmit() {
      // Handle form submission

      if (this.form.name && this.form.email && this.form.message) {

        const data = {
          from: Constants.email.form,
          to: this.form.email,
          // bc: Constants.email.form,
          subject: 'Multumim pentru mesaj',
          body: `<p>Dear ${this.form.name},<br>
            <br>
            Thank you for reaching out to us! We have received your message and will respond to you as soon as possible.<br>
            <br>
            Here are the details we received:<br>
            Message: ${this.form.message} <br>
            <br>
            Best regards,<br>
            AWB</p>
          `
        }

        console.log("data: ", data);

        await this.mailService.sendEmail(data).then(() => {
          // Reset form
          this.form.name = '';
          this.form.email = '';
          this.form.message = '';

          this.toast.add({ 
            severity: 'success', 
            summary: 'Mesajul trimis', 
            detail: 'Felicitari mesajul dumeavoastra s-a trimis cu succes, vom reveni catre dumeanvoastra in cel mai scurt timp posibil!', 
            life: 5000 
          });
        })

      }
    }
  },
  async mounted() {

  }
}

</script>