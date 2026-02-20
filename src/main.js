import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/main.css'

const app = createApp(App)

app.use(store)
app.use(router)

// Prefetch dropdown data on app initialization
store.dispatch('dropdown/fetchAllDropdowns')

app.mount('#app')
