import { createRouter, createWebHistory } from 'vue-router'
import ProductView from '../views/ProductView.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: ProductView
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: Login
    }    
  ]
})

export default router
