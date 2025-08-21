/**
 * 初始化主题 - 根据本地存储或系统偏好设置初始主题
 * 1. 检查 localStorage 中是否有保存的主题偏好
 * 2. 如果没有保存的偏好，则检查系统颜色方案偏好
 * 3. 如果满足暗色条件，则在文档根元素上添加 'dark' 类
 */
export function initTheme() {
  // 从本地存储获取之前保存的主题设置
  const savedTheme = localStorage.getItem('theme');
  
  // 检测系统是否启用了暗色模式
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 应用主题的逻辑：
  // - 如果本地存储明确设置为暗色，或者
  // - 没有保存的设置但系统偏好暗色
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.documentElement.classList.add('dark');
  }
}

/**
 * 切换主题 - 在亮色和暗色主题之间切换
 * 1. 切换文档根元素上的 'dark' 类
 * 2. 将用户的选择保存到 localStorage 以便持久化
 */
export function toggleTheme() {
  // 切换 dark 类并返回当前是否处于暗色模式
  const isDark = document.documentElement.classList.toggle('dark');
  
  // 将当前主题保存到本地存储
  // - 如果是暗色模式则保存 'dark'
  // - 否则保存 'light'
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}