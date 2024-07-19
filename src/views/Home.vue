<template>
    <div class="h-screen p-5 flex justify-center dark:text-white text-gray-700">
      <div>
        <h2 class="text-5xl mt-48">Bine ați venit</h2>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  
  export default {
    data() {
      return {
        router: useRouter(),
        authStore: useAuthStore(),
      }
    },  
    async mounted() {

    }
  }
  
  </script>