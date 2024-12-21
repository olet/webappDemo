/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境判断辅助函数
declare const VITE_DEV_SERVER_URL: string | undefined

interface Window {
  process?: any
} 

// 添加 naive-ui 的全局组件类型
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      class?: any
      style?: any
    }
  }
} 