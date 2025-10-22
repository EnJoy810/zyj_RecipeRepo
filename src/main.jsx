import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'  // 路由
import 'lib-flexible'  // 移动端适配
import './index.css'
import App from './App.jsx'
import { setupMockInterceptor } from './api/mockInterceptor'

// 设置生产环境 Mock 拦截器
setupMockInterceptor()

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>,
)
