import { createApp, createVNode } from 'vue'
import App from './App.vue'
import router from './router/index'
import { store, key } from './store'
// import axios from 'axios'
import * as echarts from 'echarts'
// Element Plus
import 'element-plus/dist/index.css'
import { components } from './plugins/element-plus'
import './permission'
import { ElMessage } from 'element-plus';

// 统一导入el-icon图标
import * as Icons from '@element-plus/icons'

const app = createApp(App)
app.use(router).use(store, key).mount('#app')

//全局配置
app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$message = ElMessage
// 注册全局icon动态组件
const Icon = (props: { icon: string }) => {
    const { icon } = props
    return createVNode(Icons[icon as keyof typeof Icons])
}
app.component('Icon', Icon)
// 按需导入Element Plus组件和插件
components.forEach(component => {
    app.component(component.name, component)
})
// plugins.forEach(plugin => {
//     app.use(plugin)
// })
