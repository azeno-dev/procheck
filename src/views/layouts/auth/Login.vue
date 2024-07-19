<template>
  <div class="flex flex-col md:flex-row h-screen">
    <!-- Left Column (Image) -->
    <div class="flex-1 flex items-center justify-center bg-white p-6">
      <img src="/src/assets/login-image.avif" alt="Placeholder Image" class="max-w-full h-auto" />
    </div>

    <!-- Right Column (Form) -->
    <div class="flex-1 flex items-center justify-center p-6">
      <form @submit.prevent="submit" class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-center">Autentificare</h2>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" id="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Parola</label>
          <input v-model="password" type="password" id="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required />
        </div>
        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 text-red-500 text-sm">
          {{ errorMessage }}
        </div>
        <button type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  name: 'LoginPage',
  setup() {
  },  
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      authStore: useAuthStore()
    };
  },
  methods: {
    async submit() {
      this.errorMessage = "";
      if (!this.email || !this.password) {
        this.errorMessage = 'Vă rugăm să introduceți atât e-mailul, cât și parola.';
        return;
      }

      console.log("this.authStore: ", this.authStore);
      // console.log("this.email: ", this.email);
      // console.log("this.password: ", this.password);

      await this.authStore.login(this.email, this.password)
        .catch(() => {
          this.errorMessage = "Email sau parola nu sunt corecte!";
        })

      if (this.authStore && this.authStore.user && this.authStore.user.token) {
        
        if (this.authStore) {
          this.$router.push({ path: "/", force: true });
        } else {
          this.errorMessage = "Email sau parola nu sunt corecte!";
        }
      }
    },
  },
  async mounted() {
    if (localStorage.getItem('pocketbase_auth')) {
      localStorage.removeItem('pocketbase_auth');
    }
  },
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style>