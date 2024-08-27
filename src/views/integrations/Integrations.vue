<template>
    <div class="container lg:max-w-7xl mx-auto text-center mt-40">
      <div class="space-y-8">
        <h1 class="text-9xl dark:text-white text-gray-800 font-bold">404</h1>
        <h2 class="text-4xl dark:text-white text-gray-800">
          Această pagină nu a fost găsită
        </h2>
        <p class="dark:text-gray-500 text-gray-800">
          Ne pare rău, pagina pe care o cauți nu a fost găsit!
        </p>
        <button
          @click="$router.push('/')"
          class="bg-primary rounded text-white py-3 px-5"
        >
          Reveniți la pagina principală
        </button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { useAuthStore } from '@/stores/auth';
  import { Constants } from '@/Constants';

  export default {
    data() {
      return {
        authStore: useAuthStore(),
      }
    },  
    async mounted() {
  
      if (this.authStore.user) {
        await this.authStore.getUser();
      }
  
      if (this.authStore && this.authStore.user) {
        // this.$router.push(Constants.primaryPage);
      } else {
        this.authStore.logout();
        // this.$router.push("/");
      }    
      // console.log("authStore: ", this.authStore);
    },
  }
  </script>@/stores/auth