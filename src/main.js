import { createApp } from 'vue'
import './style.css'
import "./assets/styles/scrollbar.css";
import App from './App.vue'
import router from './router'


export const app = createApp(App)
app.use(router)
app.mount('#app')
