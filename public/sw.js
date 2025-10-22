// Service Worker for Mock API in Production
const CACHE_NAME = 'recipe-mock-api-v1';

// 模拟数据
const secret = "**&……￥……#&*12423afa";

// JWT 工具函数
function generateJWT(payload, secret, expiresIn = '1h') {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (expiresIn === '1h' ? 3600 : 0);

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
  'POST:/api/login': (request) => {
    return new Promise((resolve) => {
      request.json().then(body => {
        const { username, password } = body;
        console.log('[SW] Login attempt:', { username, password });

        if (username !== "admin" || password !== "123") {
          resolve(new Response(JSON.stringify({
            code: 1,
            message: "用户名或密码错误",
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
          return;
        }

        const token = generateJWT({
          user: { id: "001", username: "admin" }
        }, secret);

        resolve(new Response(JSON.stringify({
          code: 0,
          message: "success",
          token,
          data: { id: "001", username: "admin" },
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }).catch(() => {
        resolve(new Response(JSON.stringify({
          code: 1,
          message: "请求参数错误"
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }));
      });
    });
  },

  'GET:/api/user': (request) => {
    return new Promise((resolve) => {
      const authHeader = request.headers.get('authorization');
      console.log('[SW] User info request, auth:', authHeader);

      if (!authHeader) {
        resolve(new Response(JSON.stringify({
          code: 1,
          message: "缺少授权头",
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = decodeJWT(token);

      if (!decoded || !decoded.user) {
        resolve(new Response(JSON.stringify({
          code: 1,
          message: "token 错误",
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
        return;
      }

      resolve(new Response(JSON.stringify({
        code: 0,
        message: "success",
        data: decoded.user,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    });
  },

  'GET:/api/search': (request) => {
    return new Promise((resolve) => {
      const url = new URL(request.url);
      const keyword = url.searchParams.get('keyword') || '';
      console.log('[SW] Search for:', keyword);

      const results = [
        `${keyword}红烧肉`,
        `${keyword}宫保鸡丁`,
        `${keyword}麻婆豆腐`,
        `${keyword}糖醋里脊`,
        `${keyword}鱼香肉丝`
      ];

      resolve(new Response(JSON.stringify({
        code: 0,
        data: results,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    });
  }
};

// 安装事件
self.addEventListener('install', event => {
  console.log('[SW] Service Worker installed');
  self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', event => {
  console.log('[SW] Service Worker activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;

  // 只拦截 API 请求
  if (path.startsWith('/api/')) {
    const key = `${method}:${path}`;
    const mockHandler = mockResponses[key];

    if (mockHandler) {
      console.log(`[SW] Intercepting ${key}`);
      event.respondWith(mockHandler(request));
      return;
    }
  }

  // 其他请求正常网络请求
  event.respondWith(fetch(request));
});