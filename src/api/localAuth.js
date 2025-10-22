// 本地认证系统 - 纯前端解决方案
import { Dialog } from "react-vant";

// 模拟用户数据库
const USERS = [
  {
    id: "001",
    username: "admin",
    password: "123",
    nickname: "管理员",
    avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
  }
];

// 生成简单的 token (基于时间戳和用户ID)
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    timestamp: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
  };
  return btoa(JSON.stringify(payload));
};

// 验证 token
const verifyToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
};

// 本地登录函数
export const doLogin = async ({ username, password }) => {
  console.log('[Local Auth] Login attempt:', { username, password });

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

  // 查找用户
  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return {
      code: 1,
      message: "用户名或密码错误",
    };
  }

  // 生成 token
  const token = generateToken(user);

  // 保存到本地存储
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  console.log('[Local Auth] Login successful:', user);

  return {
    code: 0,
    message: "success",
    token,
    data: {
      id: user.id,
      username: user.username,
    },
  };
};

// 获取当前用户信息
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return {
      code: 1,
      message: "用户未登录",
    };
  }

  const user = JSON.parse(userStr);
  const tokenData = verifyToken(token);

  if (!tokenData) {
    // Token 过期，清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      code: 1,
      message: "登录已过期",
    };
  }

  console.log('[Local Auth] Current user:', user);

  return {
    code: 0,
    message: "success",
    data: user,
  };
};

// 退出登录
export const logout = () => {
  console.log('[Local Auth] Logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// 检查登录状态
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  return token && verifyToken(token);
};

// 获取用户信息 (同步版本)
export const getUserInfo = () => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!userStr || !token) return null;

  const user = JSON.parse(userStr);
  const tokenData = verifyToken(token);

  return tokenData ? user : null;
};