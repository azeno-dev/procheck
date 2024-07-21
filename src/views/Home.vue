<template>
  <!-- <div class="h-screen p-5 flex items-center justify-center dark:text-white text-gray-700">
    <div class="text-center space-y-10">
      <h2 class="text-5xl">Bine ați venit - AWB checker</h2>
      <div class="bg-red-300 inline-block">
        <Button as="router-link" label="Autentificare" to="/auth/login"></Button>
      </div>
    </div>
  </div> -->

    <!-- Hero Section -->
    <section class="bg-gray-200 py-20">
      <div class="container mx-auto flex flex-col md:flex-row items-center">
        <div class="flex flex-col w-full md:w-1/2 justify-center items-start p-8">
          <h1 class="text-3xl md:text-5xl font-bold leading-tight">Revolutionize Your Bar Reading Experience</h1>
          <p class="text-xl mt-4">Our Bar Reader Checker makes it easy to scan, import, and export barcodes efficiently.</p>
          <button class="bg-blue-500 text-white mt-8 px-6 py-2 rounded hover:bg-blue-400">Contact Us</button>
        </div>
        <div class="w-full md:w-1/2 py-6 text-center">
          <img src="https://via.placeholder.com/400" alt="Bar Reader Checker" class="w-full md:w-3/4 mx-auto">
        </div>
      </div>
    </section>
     
    <!-- Features Section -->
    <section id="features" class="py-20">
      <div class="container mx-auto">
        <h2 class="text-4xl font-bold text-center mb-10">Features</h2>
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/3 p-4">
            <div class="bg-white shadow-lg rounded-lg p-6 text-center">
              <div class="text-blue-500 mb-4">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 11h18M3 15h18M3 19h18"></path></svg>
              </div>
              <h3 class="text-xl font-semibold">Feature 1</h3>
              <p class="mt-4">Subtitle for feature 1.</p>
            </div>
          </div>
          <!-- Repeat similar blocks for other features -->
        </div>
      </div>
    </section>

    <!-- Steps Section -->
    <section id="how" class="bg-gray-100 py-20">
      <div class="container mx-auto">
        <h2 class="text-4xl font-bold text-center mb-10">How It Works</h2>
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/3 p-4 text-center">
            <div class="bg-white shadow-lg rounded-lg p-6">
              <h3 class="text-xl font-semibold">Import</h3>
              <p class="mt-4">Subtitle for step 1.</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 p-4 text-center">
            <div class="bg-white shadow-lg rounded-lg p-6">
              <h3 class="text-xl font-semibold">Scan</h3>
              <p class="mt-4">Subtitle for step 2.</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 p-4 text-center">
            <div class="bg-white shadow-lg rounded-lg p-6">
              <h3 class="text-xl font-semibold">Export</h3>
              <p class="mt-4">Subtitle for step 3.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-20">
      <div class="container mx-auto">
        <h2 class="text-4xl font-bold text-center mb-10">What Our Customers Say</h2>
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/3 p-4">
            <div class="bg-white shadow-lg rounded-lg p-6 text-center">
              <div class="text-blue-500 mb-4">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p class="mt-4">"This product has transformed our business operations."</p>
              <h3 class="text-xl font-semibold mt-4">John Doe</h3>
            </div>
          </div>
          <!-- Repeat similar blocks for other testimonials -->
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="bg-gray-100 py-20">
      <div class="container mx-auto">
        <h2 class="text-4xl font-bold text-center mb-10">Pricing</h2>
        <div class="flex flex-wrap">
          <div class="w-full md:w-1/3 p-4 text-center">
            <div class="bg-white shadow-lg rounded-lg p-6">
              <h3 class="text-xl font-semibold">Start</h3>
              <p class="mt-4 text-2xl">$9/month</p>
              <p class="mt-4">Description for the start plan.</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 p-4 text-center">
            <div class="bg-white shadow-lg rounded-lg p-6">
              <h3 class="text-xl font-semibold">Pro</h3>
              <p class="mt-4 text-2xl">$19/month</p>
              <p class="mt-4">Description for the pro plan.</p>
            </div>
          </div>
          <div class="w-full md:w-1/3 p-4 text-center">
            <div class="bg-white shadow-lg rounded-lg p-6">
              <h3 class="text-xl font-semibold">Business</h3>
              <p class="mt-4 text-2xl">$29/month</p>
              <p class="mt-4">Description for the business plan.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-blue-500 text-white py-20">
      <div class="container mx-auto text-center">
        <h2 class="text-4xl font-bold">Get Started with Bar Reader Checker Today!</h2>
        <button class="bg-white text-blue-500 mt-8 px-6 py-2 rounded hover:bg-gray-200">Sign Up Now</button>
      </div>
    </section>    

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