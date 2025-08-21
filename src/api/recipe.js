import axios from './config'

export const getRecipes = (page) => {
  return axios.get(`/recipe?page=${page}`);
};