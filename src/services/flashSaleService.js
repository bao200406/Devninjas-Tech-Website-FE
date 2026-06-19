import api from "../axios/api.js";

export const getFlashSales = async () => {
  const response = await api.get("/flashSales");
  return response.data;
};