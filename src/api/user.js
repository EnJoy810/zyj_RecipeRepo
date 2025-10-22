import axios from './config'
import { doLogin as localLogin, getCurrentUser as localGetUser } from './localAuth'

// 获取用户信息
export const getUser = () => {
    // 在生产环境使用本地认证，开发环境使用 API
    if (import.meta.env.PROD) {
        return localGetUser();
    }
    return axios.get('/user');
}

// 登录
export const doLogin = (data) => {
    // 在生产环境使用本地认证，开发环境使用 API
    if (import.meta.env.PROD) {
        return localLogin(data);
    }
    return axios.post('/login', data)
}

