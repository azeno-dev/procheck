import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/layouts/auth/Login.vue'

import ProductView from '../views/ProductView.vue'
import Home from '../views/Home.vue'

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
    beforeEnter: authGuard,
    meta: { title: "Pagina goala" + appname },
  },  
  {
    path: '/awb',
    name: 'Produse',
    component: ProductView
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
  document.title = to.meta.title;
  next()
})

async function authGuard(to: any, from: any, next: any) {
  let isAuthenticated = false;
  const authStore = useAuthStore();
  const cookies = useCookies().cookies;
  // authStore.getUser();

  if (cookies.isKey("authStore")) {
    isAuthenticated = true;
  } else if (authStore.user && authStore.user.token) {
    isAuthenticated = true;
  }
  console.log("to: ", to);
  console.log("from: ", from);
  console.log("isAuthenticated: ", isAuthenticated);

  if (isAuthenticated) {
    if (to.name == "Login" || to.name == "Register" || to.name == "ForgotPassword") {
      next('/blank');
    } else {
      if (authStore.user) {
        await authStore.getUser();
      }

      next(); // allow to enter route               
    }
  }
  else {
    next('/auth/login');
  }
}

export default router;