import { create } from "zustand";
import { getRecipes } from "@/api/recipe";

const recipes = [
  {
    id: "1-0",
    height: 260,
    title: "宫保鸡丁",
    rating: 8.5,
    description: "经典川菜，鸡肉嫩滑，花生酥脆的下饭神器。",
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1-1",
    height: 290,
    title: "红烧肉",
    rating: 8.2,
    description: "肥瘦相间，色泽红亮，入口即化。",
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1-2",
    height: 400,
    title: "麻婆豆腐",
    rating: 9.1,
    description: "豆腐嫩滑，肉末香浓，配米饭绝配。",
    url: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1-3",
    height: 370,
    title: "糖醋里脊",
    rating: 8.7,
    description: "外酥内嫩，酸甜可口，老少皆宜。",
    url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1-4",
    height: 260,
    title: "番茄鸡蛋面",
    rating: 8.9,
    description: "简单快手，酸甜开胃，温暖的家常味道。",
    url: "https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1-5",
    height: 430,
    title: "可乐鸡翅",
    rating: 8.4,
    description: "甜蜜诱人，鸡翅软烂，两者完美融合。",
    url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1-6",
    height: 360,
    title: "蒜蓉西兰花",
    rating: 9.0,
    description: "清爽健康，蒜香浓郁，西兰花脆嫩。",
    url: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1-7",
    height: 270,
    title: "青椒土豆丝",
    rating: 8.6,
    description: "爽脆清香，简单易做，家常必备。",
    url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1-8",
    height: 330,
    title: "水煮鱼",
    rating: 9.2,
    description: "麻辣鲜香，鱼肉鲜嫩，川菜代表作。",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "1-9",
    height: 410,
    title: "蒸蛋羹",
    rating: 8.8,
    description: "嫩滑如布丁，营养丰富。",
    url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const useRecipeStore = create((set, get) => ({
  recipes: recipes, // 食谱列表
  page: 2, // 当前页码
  isLoading: false, // 是否正在加载
  isRefreshing: false, // 是否正在刷新
  fetchMore: async () => {
    // 如果还在请求中，不在发起新的请求
    if (get().isLoading) return; // 如果正在加载，直接返回
    set({ isLoading: true }); // 设置正在加载状态为 true
    const res = await getRecipes(get().page); // 调用 getRecipes 函数获取食谱列表数据
    if (res.code === 0) {
      // 如果请求成功
      // 之前的状态
      set((state) => ({
        // 更新状态
        recipes: [...state.recipes, ...res.data], // 将新获取的食谱列表数据添加到 recipes 数组中
        page: state.page + 1, // 将页码加 1
        isLoading: false, // 设置正在加载状态为 false
      }));
    }
  },
  // 刷新
  refreshRecipes: async () => {
    set({ isRefreshing: true , recipes: [], isLoading: true}); // 设置正在刷新状态为 true
    const res = await getRecipes(1); // 调用 getRecipes 函数获取食谱列表数据
    if (res.code === 0) {
      // 如果请求成功
      // 之前的状态
      set({
        // 更新状态
        recipes: res.data, // 将新获取的食谱列表数据添加到 recipes 数组中
        page: 2, // 将页码加 1
        isRefreshing: false, // 设置正在刷新状态为 false
        isLoading: false, // 设置正在加载状态为 false
      });
    }
  },
}));

export default useRecipeStore;