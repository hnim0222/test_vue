import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.ts'
import { imageErrorDirective } from './utils/imageUtils'

const app = createApp(App)

app.use(router)
app.use(createPinia())

// Register global directive for image error handling
app.directive('img-error', imageErrorDirective)

app.mount('#app')
