<template>
  <div class="h-screen p-5 flex items-center justify-center dark:text-white text-gray-700">
    <div class="text-center space-y-10">
      <h2 class="text-5xl">Bine ați venit - AWB checker</h2>
      <div class="bg-red-300 inline-block">
        <Button as="router-link" label="Autentificare" to="/auth/login"></Button>
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
      router: useRouter(),
      authStore: useAuthStore(),
    }
  },
  async mounted() {

  }
}

</script>