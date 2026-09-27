import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons.css'
import "bootstrap"
import { createPinia, getActivePinia } from 'pinia'
import piniaPlugPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia(); 
pinia.use(piniaPlugPersistedstate)

createApp(App).use(pinia).use(router).mount('#app')
