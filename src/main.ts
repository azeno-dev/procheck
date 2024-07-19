import './assets/main.css'

import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App)

const pinia = createPinia();
setActivePinia(pinia);

app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

router.isReady().then(() => {
    app.mount('#app')
});
