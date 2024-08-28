import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/layouts/auth/Login.vue'

import Home from '../views/Home.vue'
import Help from '../views/Help.vue'
import Contact from '../views/Contact.vue'
import Integrations from '../views/integrations/Integrations.vue'
import ProductView from '../views/integrations/ProductView.vue'
import SameDayView from '../views/integrations/SameDayView.vue'


// error page
import Page404 from "../views/layouts/error/404.vue";

import { useAuthStore } from '@/stores/auth';
import { useCookies } from "vue3-cookies"

var appname = " - AWB";

const routes = [
  {
    path: "/",
    name: "Acasa",
    component: Home,
    meta: { title: "Cel mai bun verificator" + appname },
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
    meta: { title: "Cel mai bun verificator" + appname },
  },
  // {
  //   path: '/check',
  //   name: 'Verificare produse',
  //   beforeEnter: authGuard,
  //   component: ProductView,
  //   meta: { title: "Cel mai bun verificator" + appname },
  // },
  {
    path: '/integrations',
    name: 'Integrari',
    beforeEnter: authGuard,
    component: Integrations,
    meta: { title: "Cel mai bun verificator" + appname },
  },    
  {
    path: '/integrations/import',
    name: 'Verificare produse - Import',
    beforeEnter: authGuard,
    component: ProductView,
    meta: { title: "Cel mai bun verificator" + appname },
  },  
  {
    path: '/integrations/sameday',
    name: 'Verificare produse - Sameday',
    beforeEnter: authGuard,
    component: SameDayView,
    meta: { title: "Cel mai bun verificator" + appname },
  },    
  {
    path: "/help",
    name: "Ajutor",
    component: Help,
    meta: { title: "Ajutor verificator" + appname },
  },
  {
    path: '/auth/login',
    name: 'Autentificare',
    component: Login
  },
  // layout/error
  {
    path: '/:pathMatch(.*)*',
    name: "Eroare 404",
    component: Page404,
    meta: { title: "Upps! 404" + appname, hideNav: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  linkExactActiveClass: "exact-active",
  linkActiveClass: 'active',
  // transitionOnLoad: true  
})

router.beforeEach((to, from, next) => {
  // document.title = to.meta.title;
  
  next()
})

async function authGuard(to: any, from: any, next: any) {
  let isAuthenticated = false;
  const authStore = useAuthStore();
  const cookies = useCookies().cookies;
  // authStore.getUser();
  // console.log("to: ", to);
  // console.log("from: ", from);
  // console.log("isAuthenticated: ", isAuthenticated);

  if (localStorage.getItem('pocketbase_auth')) {
    isAuthenticated = true;
  } else if (authStore.user && authStore.user.token) {
    isAuthenticated = true;
  }

  if (isAuthenticated) {
    if (authStore.user) {
      await authStore.getUser();
    }
    next(); // allow to enter route               
  } else {
    next('/auth/login');
  }
}

export default router;