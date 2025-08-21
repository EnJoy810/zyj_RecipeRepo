import { create } from "zustand";
import { persist } from "zustand/middleware";  // 导入持久化中间件

const useCookbookStore = create(
  persist(
    (set) => ({
      cookbook: [],
      // 菜谱收藏相关的状态管理函数
      isInCookbook: (id) => {
        return (state) => state.cookbook.some((recipe) => recipe.id === id);
      },
      addCookbook: (recipe) => 
        set((state) => {
          // 检查是否已存在
          if (state.cookbook.some((item) => item.id === recipe.id)) {
            return state;
          }
          return { cookbook: [recipe, ...state.cookbook] };
        }),
      deleteCookbook: (id) => 
        set((state) => ({ 
          cookbook: state.cookbook.filter((recipe) => recipe.id !== id) 
        })),
    }),
    {
      name: "cookbook-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCookbookStore;