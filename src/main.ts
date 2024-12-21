import { createApp } from 'vue'
import App from './App.vue'

// 引入 Naive UI
import {
  create,
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  darkTheme
} from 'naive-ui'

// 创建 naive-ui 实例
const naive = create({
  components: [
    NConfigProvider,
    NMessageProvider,
    NDialogProvider
  ]
})

const app = createApp(App)

// 使用 naive-ui
app.use(naive)

// 挂载应用
app.mount('#app') 