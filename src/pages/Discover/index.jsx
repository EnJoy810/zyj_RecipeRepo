import styles from "./discover.module.css";
import useTitle from "@/hooks/useTitle";
import useRecipeStore from "@/store/useRecipeStore"; // 修改：引入 useRecipeStore
import Waterfall from "@/components/Waterfall";
import { useNavigate } from "react-router-dom";
import { Sticky, PullRefresh } from "react-vant";
import { Search } from "@react-vant/icons";

const Discover = () => {
  const navigate = useNavigate();
  const { recipes, fetchMore, isLoading, isRefreshing, refreshRecipes } =
    useRecipeStore();

  useTitle("发现食谱");

  const handleClick = () => {
    navigate("/search");
  };

  const onRefresh = async () => {
    await refreshRecipes();
  };

  return (
    <div className={styles.discover}>
      <Sticky>
        <div className={styles.inputBox}>
          <Search className={styles.icon} />
          <input
            type="text"
            placeholder="搜菜谱、搜食材"
            className={styles.input}
            onClick={handleClick}
            readOnly
          />
        </div>
      </Sticky>
      <PullRefresh
        onRefresh={onRefresh}
        disabled={isLoading}
        loading={isRefreshing}
        successText="刷新成功！"
        pullingText="下拉刷新"
        loosingText="释放刷新"
      >
        <div>
          <Waterfall recipes={recipes} fetchMore={fetchMore} loading={isLoading} />
        </div>
      </PullRefresh>
    </div>
  );
};

export default Discover;