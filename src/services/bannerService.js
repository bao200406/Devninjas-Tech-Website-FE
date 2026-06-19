import api from "../axios/api";

export const getActiveBanners = async (position) => {
  const response = await api.get(`/banners?position=${position}`);
  return response.data;
};

export const createBanner = async (data) => {
  const response = await api.post("/banners", data);
  return response.data;
};

export const updateBanner = async (id, data) => {
  const response = await api.put(`/banners/${id}`, data);
  return response.data;
};