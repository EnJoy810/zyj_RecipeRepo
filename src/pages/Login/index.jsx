import styles from "./login.module.css";
import { useRef } from 'react';
import useUserStore from '@/store/useUserStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { Dialog } from 'react-vant'

const Login = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUserStore();

  //处理登录
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    if(!username || !password) {
      Dialog.alert({message: '用户名或密码不能为空'});
      return;
    }
    try {
      await login({username, password});
      // 登录成功后跳转到之前想访问的页面，如果没有则跳转到首页
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch {
      // 处理登录失败的情况
      Dialog.alert({message: '登录失败，请检查用户名和密码'});
    }
  }

  // 处理"验证码登录"点击（占位功能）
  const handleCodeLogin = (e) => {
    e.preventDefault();
    Dialog.alert({message: '验证码登录功能开发中...'});
  }

  // 处理"忘记密码"点击（占位功能）
  const handleForgotPassword = (e) => {
    e.preventDefault();
    Dialog.alert({message: '请联系管理员重置密码'});
  }

  return (
    <div className={styles.loginContainer}>
      {/* 标题 */}
      <h1 className={styles.loginTitle}>登录</h1>

      {/* 输入框容器 - 带动画 */}
      <div className={styles.loginCard}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {/* 账号输入框 */}
          <div className={styles.formGroup}>
            <input
              type="text"
              id="username"
              placeholder="请输入账号"
              required
              ref={usernameRef}
              className={styles.formInput}
            />
          </div>

          {/* 密码输入框 */}
          <div className={styles.formGroup}>
            <input
              type="password"
              id="password"
              placeholder="请输入密码"
              required
              ref={passwordRef}
              className={styles.formInput}
            />
          </div>

          {/* 登录按钮 */}
          <button type="submit" className={styles.loginButton}>
            登录
          </button>
        </form>

        {/* 底部链接 - 在输入框容器内部 */}
        <div className={styles.loginFooter}>
          <a href="#" className={styles.codeLogin} onClick={handleCodeLogin}>
            验证码登录
          </a>
          <a href="#" className={styles.forgotPassword} onClick={handleForgotPassword}>
            忘记密码
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
