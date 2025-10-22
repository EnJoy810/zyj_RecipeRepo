import axios from 'axios'

// 根据环境配置baseURL
const getBaseURL = () => {
  // 开发环境使用Vite的Mock服务
  if (import.meta.env.DEV) {
    return "http://localhost:5173/api"
  }
  // 生产环境使用相对路径，Service Worker 会拦截这些请求
  return "/api"
}

axios.defaults.baseURL = getBaseURL()
// interceptors: 拦截器  
axios.interceptors.request.use((config) => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token') || '';
    // 如果token存在，则将其添加到请求头中
    if (token) {
        // Bearer 是一种认证机制，用于在HTTP请求头中传递认证信息
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})
axios.interceptors.response.use(res => {
    // 已经返回了res.data，这样之后的代码就不需要再写res.data了
    return res.data
})
export default axios