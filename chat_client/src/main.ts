import {createApp} from "vue"
import App from "./App.vue"
import router from "./router"
import store from './store'

import "@/styles/index.scss"
import 'uno.css'
import 'nprogress/nprogress.css'


import "element-plus/theme-chalk/src/message.scss"
import "element-plus/theme-chalk/src/notification.scss"

const app = createApp(App)

app.use(router).use(store).mount("#app")
