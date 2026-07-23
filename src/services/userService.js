import api from "../axios/api";

/**
 * Lấy danh sách tất cả người dùng (dành cho Admin)
 * @param {Object} params - Object chứa { page, limit, search }
 */
export const getAllUsersAdmin = async (params) => {
  // params sẽ bao gồm { page, limit, search } để khớp với logic Controller đã viết
  const response = await api.get("/users/admin/all", { params });
  return response.data;
};

/**
 * Lấy chi tiết thông tin 1 người dùng theo ID
 * @param {String} userId 
 */
export const getUserByIdAdmin = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserStatus = async (userId, status) => {
  const response = await api.patch(`/users/admin/status/${userId}`, { status });
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  // Gọi API PATCH tới route admin/role/:userId
  const response = await api.patch(`/users/admin/role/${userId}`, { role });
  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await api.put("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};