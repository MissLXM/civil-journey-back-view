import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// SVG 相关
import 'virtual:svg-icons-register'
import SvgIcon from './components/svgIcon/SvgIcon.vue'

// Video 相关插件
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

// 全部引入icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 统一注册Icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.component("svg-icon", SvgIcon)

// 持久化
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(VueVideoPlayer)
app.use(router)

app.mount('#app')
