import { useState, useEffect } from 'react';
import { toggleTheme } from '@/utils/theme';
import styles from './themeToggle.module.css'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // 初始化时检查当前主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkMode = savedTheme === 'dark' || (!savedTheme && systemDark);
    setIsDark(darkMode);
  }, []);

  const handleToggle = () => {
    toggleTheme();
    setIsDark(!isDark);
  };

  return (
    <button 
      onClick={handleToggle}
      className={styles.themeButton}
    >
      {isDark ? (
        <i className='iconfont icon-moonyueliang' fontSize={20} />
      ) : (
        <i className='iconfont icon-taiyang' fontSize={20} />
      )}
    </button>
  );
}

export default ThemeToggle;