<template>
  <div class="container lg:max-w-7xl mx-auto text-center mt-10 h-[88.5vh]">

    <h1 class="text-4xl font-bold text-center mb-5">Integrării</h1>

    <div class="p-10">

      <IntegrationCard v-for="integration in integrations" :key="integration.id" :imageUrl="integration.image_url || ''"
        :active="integration.active" :service="integration.service" :doc="integration.doc || ''" :site_url="integration.site_url || ''" />

    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore, type Integration } from '@/stores/auth';
import IntegrationCard from "@/components/IntegrationCard.vue";

export default {
  data() {
    return {
      authStore: useAuthStore(),
      integrations: [] as Integration[],
    }
  },
  components: {
    IntegrationCard
  },
  async mounted() {

    if (this.authStore.user) {
      await this.authStore.getUser();
    }

    if (this.authStore && this.authStore.user) {
      this.integrations = this.authStore.integrations || [];
    } else {
      this.authStore.logout();
      // this.$router.push("/");
    }
    // console.log("authStore: ", this.authStore);
  },
}
</script>@/stores/auth