import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Skeleton, Toast } from "react-vant";
import { useEffect, useState } from "react";
import useRecipeDetailStore from "@/store/useRecipeDetailStore";
import useCookbookStore from "@/store/useCookbookStore";
import useTitle from "@/hooks/useTitle";
import styles from "./detail.module.css";
import { ArrowLeft, Plus, Cross } from "@react-vant/icons";

const Detail = () => {
  const patToken = import.meta.env.VITE_COZE_API_KEY;
  const workflowUrl = "https://api.coze.cn/v1/workflow/run";
  const workflow_id = "7541022600168882216";

  const { id } = useParams();
  // 解构获取菜谱详情数据
  const { loading, recipeDetail, setRecipeDetail } = useRecipeDetailStore();
  const { cookbook, addCookbook, deleteCookbook } = useCookbookStore();
  const { chef, servings, cookTime, description } = recipeDetail;
  const navigate = useNavigate();
  const { state } = useLocation();

  const [cookingTips, setCookingTips] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  // 直接使用传递过来的数据
  const recipe = state?.recipe;
  const { title, rating, url } = recipe || {};

  // 检查当前食谱是否已收藏
  const isInCookbook = cookbook.some((recipe) => recipe.id === id);

  // 调用 setRecipeDetail 方法获取详情数据
  useEffect(() => {
    setRecipeDetail();
  }, [setRecipeDetail]);

  // 设置页面标题
  useTitle(title || "菜谱详情");

  // 如果 state 中没有数据，可以在这里做降级处理
  if (!recipe) {
    Toast.fail("数据加载失败");
    navigate("/");
    return;
  }

  // 点击返回按钮
  const handleClickBack = () => {
    navigate(-1);
  };

  // 点击收藏菜谱
  const handleClickAdd = () => {
    addCookbook({ id, title, url, rating });
    Toast.success("加入成功");
  };

  // 点击取消收藏
  const handleClickDelete = () => {
    deleteCookbook(id);
    Toast.success("移出成功");
  };

  // 生成烹饪技巧
  const generateCookingTips = async () => {
    setIsGenerating(true);
    const parameters = {
      title,
    };

    try {
      const response = await fetch(workflowUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${patToken}`,
        },
        body: JSON.stringify({
          workflow_id,
          parameters,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // 解析data字段中的JSON字符串
      const data = JSON.parse(result.data);
      console.log("🔍 解析后的data:", data);
      
      // 尝试从output字段中提取JSON格式的烹饪技巧
      let cookingTipsData = null;
      try {
        // 检查是否有output字段包含JSON
        if (data.output) {
          const jsonMatch = data.output.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            cookingTipsData = JSON.parse(jsonMatch[1]);
            console.log("📦 从output提取的数据:", cookingTipsData);
          }
        }
        
        // 如果没有从output提取到，尝试直接从data获取
        if (!cookingTipsData && data.cookingTips) {
          cookingTipsData = { cookingTips: data.cookingTips };
        }
      } catch (parseError) {
        console.error("❌ 解析JSON失败:", parseError);
      }
      
      const tipsContent = cookingTipsData?.cookingTips?.content || "暂无技巧";
      const tipsTitle = cookingTipsData?.cookingTips?.title || "烹饪技巧";
      
      console.log("📄 最终提取的标题:", tipsTitle);
      console.log("📝 最终提取的内容:", tipsContent);

      setCookingTips({
        tipsTitle,
        tipsContent,
      });
      Toast.success("烹饪技巧生成成功");
      setIsGenerated(true);
    } catch (error) {
      console.error("生成烹饪技巧失败:", error);
      Toast.fail("生成烹饪技巧失败");
      setIsGenerated(false);
    } finally {
      setIsGenerating(false);
    }
  };

  // 跳转到烹饪技巧页面
  const handleClickViewTips = () => {
    navigate("/steps", {
      state: {
        recipe: cookingTips
      },
    });
  }

  if (loading) return <Skeleton />;
  return (
    <div className={styles.detail}>
      <div className={styles.header}>
        <ArrowLeft onClick={handleClickBack} />
        {isInCookbook ? (
          <span onClick={handleClickDelete}>
            <Cross />
            移出菜谱
          </span>
        ) : (
          <span onClick={handleClickAdd}>
            <Plus />
            加入菜谱
          </span>
        )}
      </div>
      <div className={styles.content}>
        <img src={url} alt={title} />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.author}>{chef}</div>
      <div className={styles.info}>
        <div>
          <span>{rating}</span>
          <span>评分</span>
        </div>
        <div>
          <span>{servings}</span>
          <span>份量</span>
        </div>
        <div>
          <span>{cookTime}</span>
          <span>烹饪时间</span>
        </div>
      </div>
      <div className={styles.description}>
        <span>简介</span>
        <span>&nbsp;&nbsp;{description}</span>
      </div>
      <div className={styles.button}>
        <button onClick={generateCookingTips} disabled={isGenerated}>
          {isGenerating ? "生成中..." : "生成烹饪技巧"}
        </button>
        {isGenerated && <button onClick={handleClickViewTips}>查看技巧</button>}
      </div>
    </div>
  );
};

export default Detail;