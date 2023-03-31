import axios from 'axios'
import { ElLoading } from 'element-plus'

// create an axios instance
const service = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 5000,
    // transformRequest: [data => qs.stringify(data)]
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
})
// 定义加载变量
let loading = null as any
// request interceptor
service.interceptors.request.use(
    config => {
        const userId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as any).id : ''
        // 开始加载
        loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        if (userId) {
            config.data.userId = userId
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        // 关闭加载
        loading.close()
        const res = response.data
        return res
    },
    error => {
        console.log(error)
        if (error.response) {
        } else {
        }
        return Promise.reject(error)
    }
)

export default service
