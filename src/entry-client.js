import './style.css'
import { createApp } from './main'

const { app, router } = createApp()

app.use(router).mount('#app')
