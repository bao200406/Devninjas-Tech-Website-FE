import api from "../axios/api.js";

// Lấy danh sách tất cả các chiến dịch Flash Sale
export const getFlashSales = async () => {
  const response = await api.get("/flashSales");
  return response.data;
};

export const getFlashSalesByDate = async (date) => {
  const response = await api.get(`/flashSales/byDate?date=${date}`);
  return response.data;
};