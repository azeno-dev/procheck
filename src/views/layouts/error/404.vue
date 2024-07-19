<template>
  <div class="container lg:max-w-7xl mx-auto text-center mt-40">
    <div class="space-y-8">
      <h1 class="text-9xl dark:text-white text-gray-800 font-bold">404</h1>
      <h2 class="text-4xl dark:text-white text-gray-800">
        Această pagină nu a fost găsită
      </h2>
      <p class="dark:text-gray-500 text-gray-800">
        Ne pare rău, pagina pe care o cauți
         {{ this.$route.params.pathMatch[0] }} nu a fost găsit!
      </p>
      <button
        @click="$router.push(authStore?.defaultView?.route || '/')"
        class="bg-primary rounded text-white py-3 px-5"
      >
        Reveniți la pagina principală
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';

export default {
  data() {
    return {
      authStore: useAuthStore(),
    }
  },  
  async mounted() {

    if (this.authStore.user) {
      await this.authStore.setData();
    }

    if (this.authStore && this.authStore.defaultView && this.authStore.defaultView.route) {
      this.$router.push(this.authStore.defaultView.route)
      // await this.authStore.logout();
      // this.$router.push("/auth/login");
    } else {
      await this.authStore.logout();
      this.$router.push("/auth/login");
    }    
    // console.log("authStore: ", this.authStore);
  },
}
</script>