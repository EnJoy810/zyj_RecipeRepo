import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useUserStore from "@/store/useUserStore";
import { initTheme } from '@/utils/theme';
import "./App.css";

import MainLayout from "@/components/MainLayout";
import BlankLayout from "@/components/BlankLayout";
import Loading from "@/components/Loading";
import AuthGuard from "@/components/AuthGuard";

import RecipeContent from "@/components/RecipeContent"; 

const Discover = lazy(() => import("@/pages/Discover"));
const Chat = lazy(() => import("@/pages/Chat"));

const Cookbook = lazy(() => import("@/pages/Cookbook")); 
const Account = lazy(() => import("@/pages/Account"));
const Login = lazy(() => import("@/pages/Login"));
const Search = lazy(() => import("@/pages/Search"));
const Detail = lazy(() => import("@/pages/Detail"));

function App() {
  const { isLogin } = useUserStore();
  initTheme();
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* MainLayout 包含所有带底部导航的页面 */}
          <Route element={<MainLayout />}>
            {/* 公开页面 - 无需登录 */}
            <Route path="/" element={<Navigate to="/discover" />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/cookbook" element={<Cookbook />} />
            
            {/* 需要登录的页面 - 使用 AuthGuard 保护 */}
            <Route element={<AuthGuard />}>
              <Route path="/chat" element={<Chat />} />
              <Route path="/account" element={<Account />} />
            </Route>
          </Route>
          
          {/* BlankLayout 包含无底部导航的页面 - 全部公开 */}
          <Route element={<BlankLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/steps" element={<RecipeContent />} /> 
          </Route>
          
          {/* 404 处理 */}
          <Route path="*" element={<Navigate to="/discover" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;