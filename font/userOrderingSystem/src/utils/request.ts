import axios from 'axios'
import { Toast } from 'vant'

// create an axios instance
const service = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 5000,
    // transformRequest: [data => qs.stringify(data)]
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
})
// 加载对象
let loading: any = ''
// request interceptor
service.interceptors.request.use(
    config => {
        const userId = 1
        loading = Toast.loading({
            message: '加载中...',
            forbidClick: true,
            loadingType: 'spinner',
        });
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
        loading.clear()
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
