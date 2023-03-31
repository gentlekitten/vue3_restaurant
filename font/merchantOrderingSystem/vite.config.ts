import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
// import styleImport from 'vite-plugin-style-import'
import ViteComponents, { ElementPlusResolver } from 'vite-plugin-components'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
    //按需导入element-plus组件  ElMessage 这些使用不了
    // ViteComponents({
    //   customComponentResolvers: [ElementPlusResolver()],
    // }),
    //按需导入element-plus的css样式
    // styleImport({
    //   libs: [
    //     {
    //       libraryName: 'element-plus',
    //       esModule: true,
    //       resolveStyle: name => {
    //         return `element-plus/lib/theme-chalk/${name}.css`
    //       },
    //     },
    //   ],
    // }),
  ],
  server: {
    host: '0.0.0.0', // 解决 use `--host` to expose
    port: 8080,
    open: true
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  }
})
