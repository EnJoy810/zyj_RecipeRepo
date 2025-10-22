import useTitle from "@/hooks/useTitle";
import useAccountStore from "@/store/useAccountStore";
import useUserStore from "@/store/useUserStore";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image,
  Cell,
  CellGroup,
  ActionSheet,
  Button,
  Dialog,
  Toast,
} from "react-vant";
import { FriendsO, StarO, SettingO, ClockO, GiftO } from "@react-vant/icons";
import { generateAvatar } from "@/llm";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./account.module.css";

const Account = () => {
  const { nickname, level, slogan, avatar, updateAvatar } = useAccountStore();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useUserStore();
  const actions = [
    {
      name: "AI生成头像",
      color: "#123123",
      type: 1,
    },
    {
      name: "上传头像",
      color: "#ee0a24",
      type: 2,
    },
  ];
  // 修改title
  useTitle("我的");
  // 点击头像，修改内容
  const handleClickAvatar = () => {
    setShowActionSheet(true);
  };
  // 处理头像上传
  const handleAction = async (e) => {
    if (e.type === 1) {
      // AI生成头像
      if (isGenerating) return; // 如果正在生成，直接返回，防止重复点击

      setIsGenerating(true); // 开始生成
      Toast.loading({
        message: "AI正在生成头像...",
        duration: 0, // 持续显示
        forbidClick: true, // 禁止背景点击
      });

      try {
        const text = `昵称: ${nickname}\n签名: ${slogan}`;
        const newAvatar = await generateAvatar(text);
        updateAvatar(newAvatar);
        Toast.success("头像生成成功！");
      } catch {
        Toast.fail("生成失败，请重试");
      } finally {
        setIsGenerating(false); // 无论成功失败都结束加载
        setShowActionSheet(false);
      }
    } else if (e.type === 2) {
      // 触发文件选择
      fileInputRef.current.click();
      setShowActionSheet(false);
    }
  };
  // 处理文件选择
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.match("image.*")) {
      Toast.fail("请选择图片文件");
      return;
    }

    // 检查文件大小 (例如限制为2MB)
    if (file.size > 2 * 1024 * 1024) {
      Toast.fail("图片大小不能超过2MB");
      return;
    }

    // 创建文件URL并更新头像
    const reader = new FileReader();
    reader.onload = (event) => {
      updateAvatar(event.target.result);
      Toast.success("头像上传成功");
    };
    reader.readAsDataURL(file);
  };
  // 退出登录
  const handleClickDanger = () => {
    Dialog.confirm({
      title: "确认退出登录吗？",
    })
      .then(() => {
        // 先跳转到首页，再执行登出操作
        navigate('/discover', { replace: true });
        // 延迟执行登出，确保导航完成
        setTimeout(() => {
          logout();
          Toast.success("已退出登录");
        }, 100);
      })
      .catch(() => {
        // on cancel
      });
  };
  // 点击cell
  const handleClickCell = () => {
    Toast.info({
      message: "功能正在开发中...",
    });
  };
  return (
    <div className={styles.container}>
      {/* 添加隐藏的文件输入 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>
      <div className={styles.user}>
        <Image
          round
          className={styles.avatar}
          src={avatar}
          style={{ cursor: "pointer" }}
          onClick={handleClickAvatar}
        />
        <div className={styles.ml4}>
          <div className={styles.nickname}>昵称：{nickname}</div>
          <div className={styles.level}>等级：{level}</div>
          <div className={styles.slogan}>签名：{slogan}</div>
        </div>
      </div>
      <div className={styles.ml2}>
        <div className={styles.ml1}>
          <span>1314</span>
          <span>烹饪时长</span>
        </div>
        <div className={styles.ml1}>
          <span>999</span>
          <span>收藏菜谱</span>
        </div>
        <div className={styles.ml1}>
          <span>520</span>
          <span>连续签到</span>
        </div>
      </div>
      <div className={styles.mt3} onClick={handleClickCell}>
        <CellGroup inset>
          <Cell title="我的收藏" icon={<StarO />} isLink />
          <Cell title="美食圈" icon={<FriendsO />} isLink />
          <Cell title="烹饪历史" icon={<ClockO />} isLink />
          <Cell title="福利中心" icon={<GiftO />} isLink />
          <Cell title="设置" icon={<SettingO />} isLink />
        </CellGroup>
      </div>
      <Button
        type="danger"
        className={styles.button}
        onClick={handleClickDanger}
      >
        退出登录
      </Button>
      <ActionSheet
        visible={showActionSheet}
        actions={actions}
        cancelText="取消"
        duration={300} // 动画持续时间
        onClose={() => setShowActionSheet(false)}
        onSelect={(e) => handleAction(e)}
      />
    </div>
  );
};

export default Account;
