import { create } from "zustand";
import { getRecipeDetail } from "@/api/recipeDetail";

const useRecipeDetailStore = create((set) => ({
  // 使用嵌套结构存储食谱详情数据
  recipeDetail: {
    chef: "",
    servings: "", 
    cookTime: "",
    description: ""
  },
  loading: false,
  // 使用简洁的函数命名模式
  setRecipeDetail: async () => {
    set({ loading: true });
    const res = await getRecipeDetail();
    set({
      loading: false,
      recipeDetail: res.data,
    });
  },
}));

export default useRecipeDetailStore;