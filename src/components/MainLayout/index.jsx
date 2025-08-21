import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Tabbar } from "react-vant";
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './mainLayout.module.css'
import "@/assets/icon/iconfont.css"; // 引入图标库

const tabs = [
  {
    icon: <i className="iconfont icon-faxian" />,
    title: "发现",
    path: "/discover",
  },
  {
    icon: <i className="iconfont icon-shipu" />,
    title: "我的菜谱",
    path: "/cookbook",
  },
  {
    icon: <i className="iconfont icon-liaotian" />,
    title: "AI助手",
    path: "/chat",
  },
  {
    icon: <i className="iconfont icon-yonghu" />,
    title: "我的",
    path: "/account",
  },
];

const MainLayout = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // 监听路由变化,这样刷新也不会返回首页而是呆在原有的界面
  useEffect(() => {
    const path = location.pathname;
    const index = tabs.findIndex((tab) => tab.path.toLowerCase() === path.toLowerCase());
    if (index !== -1) {
      setActive(index);
    }
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 bgc of">
        <Outlet />
      </div>
      {/* tabbar */}
      <Tabbar
        value={active}
        placeholder="true"
        fixed={true}
        className={styles.tabbar}
        activeColor="#FFD100"
        inactiveColor="#969799"
        onChange={(key) => {
          setActive(key);
          navigate(tabs[key].path);
        }}
      >
        {tabs.map((tab, index) => (
          <Tabbar.Item key={index} icon={tab.icon}>
            {tab.title}
          </Tabbar.Item>
        ))}
      </Tabbar>
    </div>
  );
};

export default MainLayout;