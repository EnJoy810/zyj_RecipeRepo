import styles from "./waterfall.module.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "@/components/RecipeCard"; 

const Waterfall = (props) => {
  const loader = useRef(null);
  const [columns, setColumns] = useState([[], []]);
  const { recipes, fetchMore, loading } = props; 
  const navigate = useNavigate();

  // 动态计算瀑布流每列的高度，当 recipes 数据变化时触发，按高度分配到两列
  useEffect(() => {
    const newColumns = [[], []];
    let newHeights = [0, 0];

    recipes.forEach((recipe) => {
      const estimatedHeight = recipe.height || 300;
      if (newHeights[0] <= newHeights[1]) {
        newColumns[0].push(recipe);
        newHeights[0] += estimatedHeight;
      } else {
        newColumns[1].push(recipe);
        newHeights[1] += estimatedHeight;
      }
    });

    setColumns(newColumns);
  }, [recipes]); 

  // 下拉/滚动加载更多的懒加载，使用 IntersectionObserver 监听 loader 是否进入视口
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        fetchMore();
      }
    });

    if (loader.current) observer.observe(loader.current);
    return () => {
      observer.disconnect();
    };
  }, [loading, fetchMore]);

  // 事件委托处理函数，绑定在父容器 columns 上，处理每张卡片点击跳转
  const handleClickNavigate = (e) => {
    const card = e.target.closest(".recipe-card-wrapper"); 
    if (!card) return;

    const id = card.dataset.id;
    // 在 recipes 中查找
    const recipe = recipes.find((recipe) => recipe.id === id); 
    navigate(`/detail/${id}`, { state: { recipe } }); // 修改：传递 recipe
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns} onClick={handleClickNavigate}>
        <div className={styles.column}>
          {columns[0].map((recipe) => ( 
            <div
              key={recipe.id}
              data-id={recipe.id}
              className="recipe-card-wrapper" 
            >
              <RecipeCard {...recipe} /> 
            </div>
          ))}
        </div>
        <div className={styles.column}>
          {columns[1].map((recipe) => ( 
            <div
              key={recipe.id}
              data-id={recipe.id}
              className="recipe-card-wrapper" 
            >
              <RecipeCard {...recipe} /> 
            </div>
          ))}
        </div>
      </div>
      <div ref={loader} className={styles.loader}>
        <div className={styles.textContainer}>
          <span className={styles.char}>加</span>
          <span className={styles.char}>载</span>
          <span className={styles.char}>中</span>
          <div className={styles.dots}>
            <div className={`${styles.dot} ${styles.dot1}`}></div>
            <div className={`${styles.dot} ${styles.dot2}`}></div>
            <div className={`${styles.dot} ${styles.dot3}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waterfall;