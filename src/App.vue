<template>

  <header class="bg-gray-400 text-white" v-if="$route.path != '/check'">
    <nav class="container mx-auto p-6 flex justify-between items-center">
      <a class="text-xl font-bold" href="/">AWB Checker</a>
      <ul class="flex space-x-6">
        <li><a href="/" class="hover:text-gray-800">Home</a></li>
        <li><a href="/#features" class="hover:text-gray-800">Features</a></li>
        <!-- <li><a href="/#how" class="hover:text-gray-800">How</a></li> -->
        <!-- <li><a href="/#testimonials" class="hover:text-gray-800">Testimonials</a></li> -->
        <li><a href="/#pricing" class="hover:text-gray-800">Pricing</a></li>
        <li><a href="/help" class="hover:text-gray-800">Help</a></li>
        <li><a href="/contact" class="hover:text-gray-800">Contact</a></li>
      </ul>

      <div v-if="!user || !user.id">
        <a class="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-400" href="/auth/login" >Login</a>
        <a class="bg-green-500 px-4 py-2 ml-4 rounded text-white hover:bg-green-400">Signup</a>
      </div>

      <div v-if="user && user.id">
        <a class="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-400" href="/check" >App</a>
        <a class="bg-green-500 px-4 py-2 ml-4 rounded text-white hover:bg-green-400">Logout</a>
      </div>
    </nav>
  </header>

  <Menubar :model="headerItems" v-if="$route.path == '/check'">
    <template #start>
      <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8">
        <path
          d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
          fill="var(--p-primary-color)" />
        <path
          d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
          fill="var(--p-text-color)" />
      </svg>
    </template>

    <template #item="{ item, props, hasSubmenu, root }">
      <a v-ripple class="flex align-items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
        <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{
    item.shortcut }}</span>
        <i v-if="hasSubmenu" :class="[
    'pi pi-angle-down',
    { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
  ]"></i>
      </a>
    </template>

    <template #end>
      <div class="flex align-items-center gap-2">
        <!-- <InputText placeholder="Search" type="text" class="w-8rem sm:w-auto" /> -->
        <p class=" my-auto mx-1">Hi, {{ user.name }}</p>
        <Button type="button" @click="toggleUserMenu" text rounded aria-haspopup="true" aria-controls="overlay_menu">
          <Avatar :image="user && user.avatar
      ? getLinkForImage(user.collectionId, user.id, user.avatar)
      : '../assets/img/user.jpg'
    " shape="circle" />
        </Button>

        <Menu ref="menuUser" id="overlay_menu" :model="userItems" :popup="true" />
      </div>
    </template>
  </Menubar>

  <!-- <RouterView /> -->
  <router-view v-slot="{ Component, route }" :key="$route.path">
    <transition name="slide-up" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>

  <Footer />
</template>

<script lang="ts">
import { ref } from "vue";

import Footer from "@/components/Footer.vue";

import { RouterView } from "vue-router";
import { useAuthStore } from '@/stores/auth';
import { Constants } from '@/Constants';

export default {
  name: "myApp", // Renaming the app so it won't conflict with the child component
  components: {
    Footer,
  },
  data() {
    return {
      sidebar: false,
      visibleSidebar: false,
      user: {
        id: null || "",
        name: null || "",
        collectionId: null || "",
        avatar: null || "",
      },
      authStore: useAuthStore(),
      items: [
        {
          label: "Home",
          icon: "pi pi-home",
          command: () => {
            this.$router.push({ path: "/", force: true });
          },
        },
        {
          label: "Features",
          icon: "pi pi-star",
        },
      ],
      headerItems: [
        // {
        //   label: "",
        //   icon: "pi pi-angle-double-right",
        //   command: () => {
        //     this.visibleSidebar = true;
        //   },
        // },
        {
          label: "Acasă",
          icon: "pi pi-home",
          command: () => {
            this.$router.push({
              path: "/",
              force: true,
            });
          },
        },
        {
          label: "Verificare",
          icon: "pi pi-envelope",
          command: () => {
            this.$router.push({
              path: "/check",
              force: true,
            });
          },
        },
        {
          label: "Ajutor",
          icon: "pi pi-info-circle",
          command: () => {
            this.$router.push({
              path: "/help",
              force: true,
            });
          },
        },
        {
          label: "Contact",
          icon: "pi pi-envelope",
          command: () => {
            this.$router.push({
              path: "/contact",
              force: true,
            });
          },
        },
      ],
      userItems: [
        {
          label: "Profil",
          items: [
            {
              label: "Setari",
              icon: "pi pi-cog",
            },
            {
              label: "Deconectare",
              icon: "pi pi-sign-out",
              command: async () => await this.logout(),
            },
          ],
        },
      ],
    };
  },
  setup() {
    const menuUser = ref();

    return {
      menuUser,
    };
  },
  methods: {
    open() {
      this.sidebar = true;
    },
    sidebarToggle() {
      this.sidebar = !this.sidebar;
    },
    toggleUserMenu(event: any) {
      if (this.menuUser) {
        this.menuUser.toggle(event);
      }
    },
    getLinkForImage(collection: string, id: string, image: string) {
      // return getLinkFile(id, image);
      return `${Constants.database.url}/api/files/${collection}/${id}/${image}?download`;
    },
    async logout() {
      this.authStore.logout();

      await this.$router.push({
        path: "/",
        force: true,
        replace: true,
      });
    },
  },
  async mounted() {
    // console.log("this.authStore.user: ", this.authStore.user);
    // console.log("this.$route: ", this.$route);

    this.user = this.authStore.getUser();
    console.log("this.user: ", this.user);

    if (this.$route.path == "/check") {
      if (!this.authStore.user) {
        if (!this.user) {
          await this.$router.push({
            path: "/auth/login",
            force: true,
            replace: true,
          });
        }
      } else {
        this.user = this.authStore.user;
      }
    }

  },
};
</script>
