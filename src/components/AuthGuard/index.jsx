import { Navigate, useLocation, Outlet } from "react-router-dom";
import useUserStore from '@/store/useUserStore';

const AuthGuard = () => {
    const { isLogin } = useUserStore();
    const { pathname } = useLocation();
    // 如果用户未登录，且当前路由不是登录页，则重定向到登录页
    if (!isLogin) {
        return <Navigate to="/login" state={{ from: pathname }} replace />;
    }
    return <Outlet />;
};

export default AuthGuard;