import axios from "./config";

// 获取详情
export const getRecipeDetail = async (id) => {
  return axios.get(`/recipeDetail?id=${id}`);
};