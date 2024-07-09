<template>
    <div class="flex flex-col md:flex-row h-screen">
      <!-- Left Column (Image) -->
      <div class="flex-1 flex items-center justify-center bg-white p-6">
        <img src="/src/assets/login-image.avif" alt="Placeholder Image" class="max-w-full h-auto" />
      </div>
  
      <!-- Right Column (Form) -->
      <div class="flex-1 flex items-center justify-center p-6">
        <form class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginPage',
  };
  </script>
  
  <style scoped>
  /* Add any additional custom styles here */
  </style>
  