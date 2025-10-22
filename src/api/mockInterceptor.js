// 生产环境 Mock 拦截器
import axios from 'axios';

// 安全密钥
const secret = "**&……￥……#&*12423afa";

// JWT 工具函数
function generateJWT(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600; // 1小时

  const headerBase64 = btoa(JSON.stringify(header));
  const payloadBase64 = btoa(JSON.stringify({ ...payload, iat: now, exp }));
  const signature = btoa(`${headerBase64}.${payloadBase64}.mock-signature`);

  return `${headerBase64}.${payloadBase64}.${signature}`;
}

function decodeJWT(token) {
  try {
    const [, payloadBase64] = token.split('.');
    return JSON.parse(atob(payloadBase64));
  } catch {
    return null;
  }
}

// Mock API 响应
const mockResponses = {
  'POST:/api/login': (data) => {
    const { username, password } = data;
    console.log('[Mock Interceptor] Login attempt:', { username, password });

    if (username !== "admin" || password !== "123") {
      return {
        code: 1,
        message: "用户名或密码错误",
      };
    }

    const token = generateJWT({
      user: { id: "001", username: "admin" }
    });

    return {
      code: 0,
      message: "success",
      token,
      data: { id: "001", username: "admin" },
    };
  },

  'GET:/api/user': (data, headers) => {
    const authHeader = headers.Authorization;
    console.log('[Mock Interceptor] User info request, auth:', authHeader);

    if (!authHeader) {
      return {
        code: 1,
        message: "缺少授权头",
      };
    }

    const token = authHeader.split(" ")[1];
    const decoded = decodeJWT(token);

    if (!decoded || !decoded.user) {
      return {
        code: 1,
        message: "token 错误",
      };
    }

    return {
      code: 0,
      message: "success",
      data: decoded.user,
    };
  },

  'GET:/api/search': (data, headers, params) => {
    const keyword = params?.keyword || '';
    console.log('[Mock Interceptor] Search for:', keyword);

    const results = [
      `${keyword}红烧肉`,
      `${keyword}宫保鸡丁`,
      `${keyword}麻婆豆腐`,
      `${keyword}糖醋里脊`,
      `${keyword}鱼香肉丝`
    ];

    return {
      code: 0,
      data: results,
    };
  }
};

// 创建 Mock 拦截器
export const setupMockInterceptor = () => {
  // 只在非开发环境启用
  if (import.meta.env.DEV) {
    return;
  }

  console.log('[Mock Interceptor] Setting up production mock API');

  // 请求拦截器
  axios.interceptors.request.use(
    (config) => {
      // 检查是否是 API 请求
      if (config.url?.startsWith('/api/')) {
        console.log('[Mock Interceptor] Intercepting API request:', config.method?.toUpperCase(), config.url);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  axios.interceptors.response.use(
    (response) => {
      // 如果响应正常，直接返回
      return response;
    },
    async (error) => {
      // 如果是网络错误或 404，尝试使用 Mock 数据
      const { config, response } = error;

      if (config?.url?.startsWith('/api/') && (!response || response.status === 404 || response.status === 405)) {
        const key = `${config.method?.toUpperCase()}:${config.url}`;
        const mockHandler = mockResponses[key];

        if (mockHandler) {
          console.log('[Mock Interceptor] Using mock response for:', key);

          let data;
          if (config.method === 'post' && config.data) {
            data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
          }

          const mockResponse = mockHandler(
            data,
            config.headers,
            config.params
          );

          // 模拟网络延迟
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

          // 返回模拟响应
          return Promise.resolve({
            data: mockResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {},
          });
        }
      }

      return Promise.reject(error);
    }
  );
};