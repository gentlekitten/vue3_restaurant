import { createApp, createVNode } from 'vue'
import App from './App.vue'
import router from './router/index'
import { store, key } from './store'
import '../src/style/rem.scss'
import axios from 'axios'
import { components } from './plugins/vant'
import { Toast } from 'vant';
import './permission'

const app = createApp(App)
app.use(router).use(store, key).mount('#app')

//全局配置
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$toast = Toast;
// vant按需引入
components.forEach(component => {
    app.component(component.name, component)
})
