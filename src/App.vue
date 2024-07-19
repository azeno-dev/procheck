<template>
  <!-- <RouterView /> -->
  <router-view v-slot="{ Component, route }" :key="$route.path">
    <transition name="slide-up" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>

  <Footer />
</template>

<script lang="ts">
import Menubar from "primevue/menubar";
import Avatar from "primevue/avatar";
import InputText from "primevue/inputtext";
import Badge from "primevue/badge";

import { RouterLink, RouterView } from 'vue-router'
import Footer from '@/components/Footer.vue';

export default {
  name: "myApp", // Renaming the app so it won't conflict with the child component
  components: {
    Footer,
    Menubar,
    Avatar,
    InputText,
    Badge
  },
  data() {
    return {
      items: [
        {
          label: 'Home',
          icon: 'pi pi-home',
          command: () => {
            this.$router.push({ path: "/", force: true });
          }
        },
        {
          label: 'Features',
          icon: 'pi pi-star'
        }
      ]
    };
  },
}
</script>
