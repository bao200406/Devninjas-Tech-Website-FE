import api from "../axios/api";

// 1. Tạo session thanh toán Stripe
export const createStripePayment = async (orderData) => {
  const response = await api.post("/payments/stripe/create", orderData);
  return response.data;
};

// 2. Thanh toán COD
export const createCODOrder = async (orderData) => {
  const response = await api.post("/payments/cod", orderData);
  return response.data;
};