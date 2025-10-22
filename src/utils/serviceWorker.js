// Service Worker 注册和管理
export const registerServiceWorker = async () => {
  // 只在生产环境和 HTTPS 环境下注册
  if (import.meta.env.DEV || !('serviceWorker' in navigator)) {
    console.log('[SW] Service Worker not registered: development mode or not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('[SW] Service Worker registered successfully:', registration.scope);

    // 等待 Service Worker 激活
    if (registration.active) {
      console.log('[SW] Service Worker is already active');
    } else {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[SW] New Service Worker found');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            console.log('[SW] Service Worker activated');
            // 可以在这里显示一个通知告诉用户更新已完成
          }
        });
      });
    }

  } catch (error) {
    console.error('[SW] Service Worker registration failed:', error);
  }
};

// 检查 Service Worker 更新
export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
    }
  }
};

// 取消注册 Service Worker
export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    console.log('[SW] Service Worker unregistered');
  }
};