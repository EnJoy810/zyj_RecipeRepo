import styles from "./loading.module.css";

const Loading = () => {
  return (
    <div className={styles.container}>
      {/* 加载文字 - 波浪式动画 */}
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
  );
};

export default Loading;
