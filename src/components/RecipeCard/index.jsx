import styles from "./recipecard.module.css"; 
import { useRef, useEffect } from "react";

const RecipeCard = (props) => { 
  const { url, height, rating, description, title } = props;
  const imgRef = useRef(null);

  useEffect(() => {
    // 图片懒加载
    const observer = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const oImg = document.createElement("img");
        oImg.src = img.dataset.src;
        oImg.onload = () => {
          img.src = img.dataset.src;
          img.style.opacity = 1; // 图片加载完成后显示
        };
        obs.unobserve(img);
      }
    });
    if (imgRef.current) observer.observe(imgRef.current);

    return () => {
      //unobserve 图片加载完成后，取消对图片的监听，防止内存泄漏
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, []);

  return (
    <div className={styles.card} style={{ height }}>
      <div className={styles.imageContainer}>
        <img
          ref={imgRef}
          data-src={url}
          className={styles.img}
          alt={description}
        />
        <p className={styles.title}>{title}</p>
        <div className={styles.ratingBadge}>
          <span className={styles.ratingIcon}>★</span>
          <span className={styles.ratingValue}>{rating}</span>
        </div>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default RecipeCard; 