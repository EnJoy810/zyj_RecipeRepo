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
          <Route element={<AuthGuard />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/discover" />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/cookbook" element={<Cookbook />} /> 
              <Route path="/account" element={<Account />} />
            </Route>
          </Route>
          <Route element={<BlankLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/steps" element={<RecipeContent />} /> 
          </Route>
          <Route path="*" element={isLogin ? <Navigate to="/discover" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;