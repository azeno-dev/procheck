<template>
  <RouterView />
  <Footer/>
</template>

<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Footer from '@/components/Footer.vue';

export default {
  name: "myApp", // Renaming the app so it won't conflict with the child component
  components: {
    Footer
  }
}
</script>

