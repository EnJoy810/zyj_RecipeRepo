import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 安全密钥
const secret = "**&……￥……#&*12423afa";

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });

  if (username !== "admin" || password !== "123") {
    return res.status(200).json({
      code: 1,
      message: "用户名或密码错误",
    });
  }

  // 生成token
  const token = jwt.sign(
    {
      user: {
        id: "001",
        username: "admin",
      },
    },
    secret,
    {
      expiresIn: "1h",
    }
  );

  return res.status(200).json({
    code: 0,
    message: "success",
    token,
    data: {
      id: "001",
      username: "admin",
    },
  });
});

// 用户信息接口
app.get('/api/user', (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(200).json({
      code: 1,
      message: "缺少授权头",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    console.log('User info requested:', decoded.user);
    return res.status(200).json({
      code: 0,
      message: "success",
      data: decoded.user,
    });
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(200).json({
      code: 1,
      message: "token 错误",
    });
  }
});

// 搜索接口
app.get('/api/search', (req, res) => {
  const keyword = req.query.keyword;
  console.log('Search for:', keyword);

  // 模拟搜索结果
  const results = [
    `${keyword}红烧肉`,
    `${keyword}宫保鸡丁`,
    `${keyword}麻婆豆腐`,
  ];

  return res.status(200).json({
    code: 0,
    data: results,
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Mock server is running'
  });
});

// 404 处理
app.use('*', (req, res) => {
  console.log('404 for:', req.method, req.originalUrl);
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST /api/login - 用户登录`);
  console.log(`   GET  /api/user  - 获取用户信息`);
  console.log(`   GET  /api/search - 搜索功能`);
  console.log(`   GET  /health   - 健康检查`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});