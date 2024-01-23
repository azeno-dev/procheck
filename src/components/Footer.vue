<!-- Footer.vue -->

<template>
  <footer class="bg-gray-400 text-black py-4">
    <div class="container mx-auto flex justify-between items-center">
      <p class="mx-auto">&copy; {{ (new Date()).getFullYear() }} - v{{ version }} - Power by <a href="https://azeno.ro" target="_blank" class="text-cyan-600 hover:text-cyan-400">Azeno</a> </p>
    </div>
  </footer>
</template>

<script lang="ts">
import { version } from "../../package.json";

export default {
  data() {
    return {
      version: version
    }
  }
  // You can add any necessary logic or data properties here
};
</script>

<style scoped>
/* Add styles for the footer if needed */
</style>
