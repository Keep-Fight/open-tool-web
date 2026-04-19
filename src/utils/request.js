import axios from 'axios'

const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000
})

// 请求拦截
service.interceptors.request.use(config => {
    // 可加 token
    return config
})

// 响应拦截
service.interceptors.response.use(
    res => res.data,
    err => {
        console.error(err)
        return Promise.reject(err)
    }
)

export default service