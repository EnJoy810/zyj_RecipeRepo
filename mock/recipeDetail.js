import Mock from "mockjs";

const detailData = Mock.mock({
  chef: "@cname",
  servings: "@integer(2, 6) 人份",
  cookTime: "@integer(15, 90) 分钟",
  description: "@cparagraph(3, 5)"
});

export default [
  {
    url: "/api/recipeDetail",
    method: "get",
    timeout: 500, 
    response: () => {
      return {
        code: 0,
        message: "success",
        data: detailData,
      };
    },
  },
];