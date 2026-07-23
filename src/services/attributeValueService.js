import api from "../axios/api.js";

export const createAttributeValue = async (data) => {
  const response = await api.post("/attributeValues", data);
  return response.data;
};