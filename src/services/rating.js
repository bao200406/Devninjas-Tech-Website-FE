import api from "../axios/api";


export const createRating = async (ratingData) => {
  const response = await api.post("/ratings", ratingData);
  return response.data;
};

export const getRatingsByProduct = async (productId, queryParams = {}) => {
  const response = await api.get(`/ratings/product/${productId}`, {
    params: queryParams,
  });
  return response.data;
};