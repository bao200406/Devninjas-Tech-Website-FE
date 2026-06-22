import api from "../axios/api.js";

// 1. Lấy danh sách sản phẩm thuộc một chiến dịch cụ thể
export const getFlashSaleItems = async (flashSaleId) => {
  const response = await api.get(`/flashSaleItems/${flashSaleId}`);
  return response.data;
};

// 2. Mua hàng (Trigger nghiệp vụ mua hàng)
export const purchaseItem = async (itemId, quantity = 1) => {
  const response = await api.post(`/flashSaleItems/purchase/${itemId}`, { 
    quantity 
  });
  return response.data;
};