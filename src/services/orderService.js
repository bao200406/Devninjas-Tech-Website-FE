import api from "../axios/api";

export const createOrder = async (data) => {
  const response = await api.post("/orders", data);

  return response.data;
};