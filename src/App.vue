<template>
  <Menubar :model="headerItems" v-if="$route.path == '/check'">
    <template #start>
      <svg
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        stroke="#000000"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M526.628571 512L190.171429 285.257143l343.771428-219.428572 336.457143 219.428572z"
            fill="#10B981"
          ></path>
          <path
            d="M526.628571 541.257143c-7.314286 0-7.314286 0-14.628571-7.314286L175.542857 307.2c-7.314286 0-7.314286-14.628571-7.314286-21.942857 0-7.314286 7.314286-14.628571 14.628572-21.942857L519.314286 36.571429c7.314286-7.314286 21.942857-7.314286 29.257143 0l343.771428 219.428571c7.314286 7.314286 14.628571 14.628571 14.628572 21.942857 0 7.314286-7.314286 14.628571-14.628572 21.942857L541.257143 533.942857s-7.314286 7.314286-14.628572 7.314286zM241.371429 285.257143l285.257142 190.171428 292.571429-190.171428-292.571429-190.171429-285.257142 190.171429z"
            fill="#10B981"
          ></path>
          <path
            d="M526.628571 716.8L124.342857 446.171429c-14.628571-7.314286-21.942857-29.257143-7.314286-36.571429 7.314286-14.628571 21.942857-14.628571 36.571429-7.314286L533.942857 658.285714l394.971429-256c14.628571-7.314286 29.257143-7.314286 36.571428 7.314286s7.314286 29.257143-7.314285 36.571429L526.628571 716.8z"
            fill="#10B981"
          ></path>
          <path
            d="M526.628571 877.714286L124.342857 607.085714c-14.628571-7.314286-21.942857-21.942857-7.314286-36.571428 7.314286-14.628571 21.942857-14.628571 36.571429-7.314286l380.342857 256 394.971429-256c14.628571-7.314286 29.257143-7.314286 36.571428 7.314286 7.314286 14.628571 7.314286 29.257143-7.314285 36.571428L526.628571 877.714286z"
            fill="#10B981"
          ></path>
        </g>
      </svg>
    </template>

    <template #item="{ item, props, hasSubmenu, root }">
      <a v-ripple class="flex align-items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <Badge
          v-if="item.badge"
          :class="{ 'ml-auto': !root, 'ml-2': root }"
          :value="item.badge"
        />
        <span
          v-if="item.shortcut"
          class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
          >{{ item.shortcut }}</span
        >
        <i
          v-if="hasSubmenu"
          :class="[
            'pi pi-angle-down',
            { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root },
          ]"
        ></i>
      </a>
    </template>
    <template #end>
      <div class="flex align-items-center gap-2">
        <!-- <InputText placeholder="Search" type="text" class="w-8rem sm:w-auto" /> -->
        <Button
          type="button"
          @click="toggleUserMenu"
          text
          rounded
          aria-haspopup="true"
          aria-controls="overlay_menu"
        >
          <Avatar
            :image="
              user && user.avatar
                ? getLinkForImage(user.collectionId, user.id, user.avatar)
                : '../assets/img/user.jpg'
            "
            shape="circle"
          />
        </Button>

        <Menu
          ref="menuUser"
          id="overlay_menu"
          :model="userItems"
          :popup="true"
        />
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

import { RouterLink, RouterView } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { Constants } from "./Constants.mjs";

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
        {
          label: "",
          icon: "pi pi-angle-double-right",
          command: () => {
            this.visibleSidebar = true;
          },
        },
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
        path: "/auth/login",
        force: true,
        replace: true,
      });
    },
  },
  async mounted() {
    console.log("this.authStore.user: ", this.authStore.user);
    console.log("this.$route: ", this.$route);

    if (this.$route.path == "/check") {
      if (!this.authStore.user) {
        this.user = await this.authStore.getUser();
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
