import api from "../axios/api";

export const registerUser = async (userData) => {
  // userData chính là object chứa {name, email, phone, password, confirmPassword, agreeTerms}
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  // userData chính là object chứa {email, password}
  const response = await api.post("/auth/login", userData);
  return response.data;
};