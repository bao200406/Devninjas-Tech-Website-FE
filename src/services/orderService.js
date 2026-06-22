import api from "../axios/api";

export const createOrder = async (data) => {
  const response = await api.post("/orders", data);

  return response.data;
};

export const getOrderByUser = async (params) => {
  // params có thể là { status: 'ĐANG GIAO', page: 1, limit: 10 }
  const res = await api.get('/orders/my-orders', { params });
  return res.data;
};

export const getOrderById = async (orderId, config = {} ) => {
  const response = await api.get(`/orders/${orderId}`, config);
  return response.data;
};