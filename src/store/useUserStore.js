import { create } from "zustand";
import { doLogin } from "@/api/user";
import { Dialog } from "react-vant";
import { persist } from "zustand/middleware"; // 导入持久化中间件
import { getUserInfo } from "@/api/localAuth";

const useUserStore = create(
  persist(
    (set) => ({
      user: null, // 用户信息
      isLogin: false, // 是否登录
      login: async ({ username = "", password = "" }) => {
        // 登录方法
        const res = await doLogin({ username, password }); // 调用登录接口
        if (res.code === 1) {
          Dialog.alert({ message: `${res.message}` });
          return res.message;
        }
        const { data: user } = res; // 解构出user信息 (token已在localAuth中处理)
        set({
          // 更新状态
          user, // 用户信息
          isLogin: true, // 是否登录
        });
      },

      // 初始化登录状态
      initAuth: () => {
        const userInfo = getUserInfo();
        if (userInfo) {
          set({
            user: userInfo,
            isLogin: true,
          });
        }
      },
      logout: () => {
        // 清除所有认证信息
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({
          // 更新状态
          user: null, // 用户信息
          isLogin: false, // 是否登录
        });
      },
    }),
    {
      name: "user-storage", // 存储的key
      getStorage: () => localStorage, // 使用localStorage
    }
  )
);

export default useUserStore;
