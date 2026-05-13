import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router/router.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Quasar, Notify, Dialog } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'quasar/src/css/index.sass'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: { Notify, Dialog },
  config: {
    dark: true
  }
})

myApp.use(pinia)
myApp.use(router)
myApp.mount('#app')