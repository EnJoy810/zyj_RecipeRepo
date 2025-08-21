import axios from './config'

// 获取用户信息
export const getUser = () => {
    return axios.get('/user');
}

// 登录
export const doLogin = (data) => {
    return axios.post('/login' , data)
}

