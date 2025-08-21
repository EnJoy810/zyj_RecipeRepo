import { create } from "zustand";
import { persist } from "zustand/middleware"; // 导入持久化中间件

const useAccountStore = create(
  persist(
    (set, get) => ({
      nickname: "哈基米",
      level: "5级",
      slogan: "炸鸡可乐是绝配",
      avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
      updateAvatar: (newAvatar) => {
        set({ avatar: newAvatar });
      },
    }),
    {
      name: "account-storage", // 存储的key
      getStorage: () => localStorage, // 使用localStorage
    }
  )
);

export default useAccountStore;
