import Mock from "mockjs";

// 真实的食谱名称和描述数据池
const recipePool = [
  { title: "宫保鸡丁", description: "经典川菜，酸甜微辣" },
  { title: "红烧肉", description: "肥瘦相间，色泽红亮，入口即化" },
  { title: "番茄鸡蛋面", description: "酸甜开胃，鸡蛋嫩滑，面条爽滑" },
  { title: "蒜蓉西兰花", description: "清爽健康，蒜香浓郁，西兰花脆嫩" },
  { title: "糖醋里脊", description: "外酥内嫩，酸甜可口" },
  { title: "麻婆豆腐", description: "麻辣鲜香，正宗川味" },
  { title: "可乐鸡翅", description: "可乐甜蜜，鸡翅软烂，两者完美融合" },
  { title: "青椒土豆丝", description: "爽脆清香，简单易做" },
  { title: "水煮鱼", description: "麻辣鲜香，鱼肉鲜嫩，豆芽爽脆" },
  { title: "蒸蛋羹", description: "嫩滑如布丁，营养丰富，老人小孩都爱吃" },
  { title: "回锅肉", description: "肥而不腻，香辣下饭" },
  { title: "鱼香肉丝", description: "酸甜咸辣，色泽红润，肉丝嫩滑，配菜丰富" },
  { title: "白切鸡", description: "皮爽肉嫩，清淡鲜美" },
  { title: "酸辣土豆丝", description: "酸辣开胃，爽脆可口，家常下饭菜" },
  { title: "蛋炒饭", description: "粒粒分明，蛋香浓郁，经典主食" }
];

// 每页10
const getRecipes = (page, pageSize = 10) => {
  return Array.from({ length: pageSize }, (_, index) => {
    // 从食谱池中随机选择一个
    const recipe = recipePool[Math.floor(Math.random() * recipePool.length)];
    
    return {
      // 生成唯一索引
      id: `${page}-${index}`,
      // 随机高度，用于瀑布流布局算法
      height: Mock.Random.integer(260, 430),
      // 使用真实的食谱名称
      title: recipe.title,
      // 随机评分范围1-10分
      rating: Mock.Random.float(1, 10, 0, 1),
      // 使用真实的食谱描述
      description: recipe.description,
      // 完全复刻BookStack的图片URL生成方式
      url: function () {
        const width = Mock.Random.integer(200, 500); // 随机宽度
        const height = Mock.Random.integer(300, 600); // 随机高度
        return `https://picsum.photos/${width}/${height}`; // 使用Lorem Picsum服务
      }
    };
  });
};

export default [
  {
    // ?page=1  queryString
    url: "/api/recipe",
    method: "get",
    timeout: 500,
    response: ({ query }) => {
      const page = Number(query.page) || 2; // 获取页码，默认为2，第一页我自己设计了
      return {
        code: 0,
        data: getRecipes(page),
      };
    },
  },
];