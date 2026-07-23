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

// Bước 1: Gọi API quên mật khẩu
export const forgotPassword = async (email) => {
  // Gửi đúng tham số email như Backend mong đợi
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

// Bước 2: Gọi API xác thực OTP
export const verifyOtp = async (email, otp) => {
  // Gửi đúng email và otp như Backend mong đợi
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

// Bước 3: Gọi API đổi mật khẩu mới
export const resetPassword = async (email, newPassword) => {
  // Gửi đúng email và mật khẩu mới như Backend mong đợi
  const response = await api.post("/auth/reset-password", { email, newPassword });
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  // Gửi thẳng oldPassword và newPassword lên.
  // Token sẽ tự động được gửi qua Axios Interceptor trong Header
  const response = await api.post("/auth/change-password", { 
    oldPassword, 
    newPassword 
  });
  return response.data;
};