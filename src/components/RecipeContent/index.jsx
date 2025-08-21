import styles from "./recipecontent.module.css"; 
import { useLocation } from "react-router-dom";
import { Cross } from "@react-vant/icons";
import { useNavigate } from "react-router-dom";

const RecipeContent = () => { 
  const location = useLocation();
  const navigate = useNavigate();

  // 从 state 中安全地获取数据，并提供默认值
  const { tipsTitle = "烹饪技巧", tipsContent = "暂无技巧" } = location.state?.recipe || {};

  return (
    <>
      <div className={styles.recipeContent}> 
        <div className={styles.title}>
          {tipsTitle}
          <Cross className={styles.close} onClick={() => navigate(-1)} />
        </div>
        <div className={styles.content}>
          {/* 将烹饪技巧字符串按换行符分割并渲染 */}
          {tipsContent.split("\n").map((item, index) => (
            <p key={index}>&nbsp;&nbsp;&nbsp;&nbsp;{item}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecipeContent; 