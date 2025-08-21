import useCookbookStore from "@/store/useCookbookStore";
import useTitle from "@/hooks/useTitle";
import { Sticky } from "react-vant";
import { useNavigate } from "react-router-dom";
import styles from "./cookbook.module.css";

const Cookbook = () => {
  const { cookbook } = useCookbookStore();
  const navigate = useNavigate();

  useTitle("我的菜谱");

  // 事件委托：通过父元素捕获子元素点击事件
  const handleClickRecipe = (event) => {
    // 1. 找到被点击的食谱元素（通过 closest 或 dataset）
    const recipeElement = event.target.closest(`.${styles.recipe}`);
    if (!recipeElement) return; // 如果点击的不是食谱，直接返回

    // 2. 从 dataset 获取食谱 ID
    const recipeId = recipeElement.dataset.id;
    if (!recipeId) return;

    // 3. 根据 ID 找到对应的食谱数据
    const recipe = cookbook.find((item) => item.id === recipeId);
    if (!recipe) return;

    // 4. 跳转到详情页
    navigate(`/detail/${recipe.id}`, {
      state: { recipe }, // 传递可序列化的食谱数据
    });
  };

  return (
    <div className={styles.cookbook}>
      <Sticky>
        <h1 className={styles.h1}>我&nbsp;&nbsp;的&nbsp;&nbsp;菜&nbsp;&nbsp;谱</h1>
      </Sticky>
      <div className={styles.recipeList} onClick={handleClickRecipe}>
        {cookbook.map((recipe) => (
          <div
            key={recipe.id}
            className={styles.recipe}
            data-id={recipe.id} // 存储食谱 ID
          >
            <img src={recipe.url} alt={recipe.title} />
            <p>{recipe.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cookbook;