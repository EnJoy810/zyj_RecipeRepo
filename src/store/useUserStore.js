import { create } from "zustand";
import { doLogin } from "@/api/user";
import { Dialog } from "react-vant";
import { persist } from "zustand/middleware"; // 导入持久化中间件

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null, // 用户信息
      isLogin: false, // 是否登录
      login: async ({ username = "", password = "" }) => {
        // 登录方法
        const res = await doLogin({ username, password }); // 调用登录接口
        if (res.code === 1) {
          Dialog.alert({ message: `${res.message}` });
          return res.message;
        }
        const { token, data: user } = res; // 解构出token和user信息
        localStorage.setItem("token", token); // 存储token到localStorage中
        set({
          // 更新状态
          user, // 用户信息
          isLogin: true, // 是否登录
        });
      },
      logout: () => {
        localStorage.removeItem("token"); // 移除token
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
