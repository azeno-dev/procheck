<template>
  <div class="h-[90.4vh] py-10">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-10">Contact Us</h2>
      <p class="text-center">Signup now. Its free and takes less than 3 minutes</p>
      <div class="max-w-xl mx-auto bg-white p-8 rounded shadow-lg">
        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label for="name" class="block text-gray-700 font-semibold mb-2">Name</label>
            <input type="text" id="name" v-model="form.name"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div class="mb-6">
            <label for="email" class="block text-gray-700 font-semibold mb-2">Email</label>
            <input type="email" id="email" v-model="form.email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div class="mb-6">
            <label for="message" class="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea id="message" v-model="form.message"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4"
              required></textarea>
          </div>
          <div class="text-center">
            <button type="submit" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-400">Send
              Message</button>
          </div>
        </form>
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
    handleSubmit() {
      // Handle form submission
      alert(`Message sent by ${this.form.name}`);
      // Reset form
      this.form.name = '';
      this.form.email = '';
      this.form.message = '';
    }
  },
  async mounted() {

  }
}

</script>