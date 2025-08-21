import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'  // 路由
import 'lib-flexible'  // 移动端适配
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>,
)
