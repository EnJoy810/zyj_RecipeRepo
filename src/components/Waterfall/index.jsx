import styles from "./waterfall.module.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "@/components/RecipeCard"; // 修改：引入 RecipeCard

const Waterfall = (props) => {
  const loader = useRef(null);
  const [columns, setColumns] = useState([[], []]);
  const [heights, setHeights] = useState([0, 0]);
  const { recipes, fetchMore, loading } = props; // 修改：books -> recipes
  const navigate = useNavigate();

  useEffect(() => {
    const newColumns = [[], []];
    let newHeights = [0, 0];

    // 修改：处理 recipes
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
    setHeights(newHeights);
  }, [recipes]); // 修改：依赖项 books -> recipes

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
  }, [loading]);

  const handleClickNavigate = (e) => {
    // 修改：更新 class name
    const card = e.target.closest(".recipe-card-wrapper"); 
    if (!card) return;

    const id = card.dataset.id;
    // 修改：在 recipes 中查找
    const recipe = recipes.find((recipe) => recipe.id === id); 
    navigate(`/detail/${id}`, { state: { recipe } }); // 修改：传递 recipe
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.columns} onClick={handleClickNavigate}>
        <div className={styles.column}>
          {columns[0].map((recipe) => ( // 修改：book -> recipe
            <div
              key={recipe.id}
              data-id={recipe.id}
              className="recipe-card-wrapper" // 修改：class name
            >
              <RecipeCard {...recipe} /> {/* 修改：使用 RecipeCard */}
            </div>
          ))}
        </div>
        <div className={styles.column}>
          {columns[1].map((recipe) => ( // 修改：book -> recipe
            <div
              key={recipe.id}
              data-id={recipe.id}
              className="recipe-card-wrapper" // 修改：class name
            >
              <RecipeCard {...recipe} /> {/* 修改：使用 RecipeCard */}
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