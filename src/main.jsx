import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'  // 路由
import 'lib-flexible'  // 移动端适配
import './index.css'
import App from './App.jsx'
import useUserStore from './store/useUserStore'

// 初始化认证状态
const userStore = useUserStore.getState();
userStore.initAuth();

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>,
)
