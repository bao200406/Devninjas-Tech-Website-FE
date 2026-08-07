import api from "../axios/api";

// Gọi API AI so sánh sản phẩm dựa trên danh sách ID sản phẩm và nhu cầu của user
export const compareProductsWithAI = async (productIds, userNeed) => {
  const response = await api.post("/ai/compare-products", {
    productIds,
    userNeed
  });
  return response.data;
};