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

// Hàm mới: Lấy thông tin user hiện tại qua Cookie
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data.data; // Trả về object user
};

// Bổ sung thêm hàm logout để dùng trong AuthContext
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};