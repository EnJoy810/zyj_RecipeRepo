import styles from "./login.module.css";
import { useRef } from 'react';
import useUserStore from '@/store/useUserStore'
import { useNavigate } from 'react-router-dom'
import { Dialog } from 'react-vant'

const Login = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
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
      // 登录成功后跳转到首页
      navigate('/');
    } catch (error) {
      // 处理登录失败的情况
      Dialog.alert({message: '登录失败，请检查用户名和密码'});
    }
    
  }
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h2>欢迎回来</h2>
          <p>请登录您的账户</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              placeholder="请输入用户名"
              required
              ref={usernameRef}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              placeholder="请输入密码"
              required
              ref={passwordRef}
              className={styles.formInput}
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            登录
          </button>
        </form>

      </div>

      <div className={styles.decorationBook}></div>
      <div className={styles.decorationPen}></div>
    </div>
  );
};

export default Login;
